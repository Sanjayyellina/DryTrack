import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Bin } from '@/types/database'

const STATUS_CONFIG = {
  empty:    { label: 'Empty',    bg: 'bg-gray-50',     border: 'border-gray-200',  text: 'text-gray-400',  dot: 'bg-gray-300'   },
  intake:   { label: 'Intake',   bg: 'bg-amber-50',    border: 'border-amber-200', text: 'text-amber-600', dot: 'bg-amber-400'  },
  drying:   { label: 'Drying',   bg: 'bg-orange-50',   border: 'border-orange-200',text: 'text-orange-600',dot: 'bg-orange-400' },
  ready:    { label: 'Ready',    bg: 'bg-green-50',    border: 'border-green-200', text: 'text-green-600', dot: 'bg-green-400'  },
  shelling: { label: 'Shelling', bg: 'bg-purple-50',   border: 'border-purple-200',text: 'text-purple-600',dot: 'bg-purple-400' },
}

function BinCard({ bin }: { bin: Bin }) {
  const cfg = STATUS_CONFIG[bin.status] ?? STATUS_CONFIG.empty

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-4 cursor-pointer hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-gray-500 tracking-wide">BIN-{bin.bin_number}</span>
        <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      </div>

      {bin.status === 'empty' ? (
        <div className="text-sm text-gray-300 font-medium">Empty</div>
      ) : (
        <>
          <div className="text-sm font-semibold text-gray-800 truncate mb-1">{bin.hybrid ?? '—'}</div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{bin.qty ? `${bin.qty}T` : '—'}</span>
            <span className={`text-xs font-semibold ${cfg.text}`}>
              {bin.current_moisture != null ? `${bin.current_moisture}%` : '—'}
            </span>
          </div>
          {bin.current_moisture != null && (
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (bin.current_moisture / 30) * 100)}%`,
                  backgroundColor: bin.current_moisture <= 12 ? '#22c55e' : bin.current_moisture <= 16 ? '#f59e0b' : '#ef4444'
                }}
              />
            </div>
          )}
        </>
      )}

      <div className={`mt-2 text-[10px] font-semibold uppercase tracking-wide ${cfg.text}`}>
        {cfg.label}
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [binsRes, intakesRes, dispatchesRes, companyRes] = await Promise.all([
    supabase.from('bins').select('*').order('bin_number'),
    supabase.from('intakes').select('id, qty, created_at'),
    supabase.from('dispatches').select('id, qty, created_at'),
    supabase.from('companies').select('name, bin_count').single(),
  ])

  const bins: Bin[] = binsRes.data ?? []
  const intakes = intakesRes.data ?? []
  const dispatches = dispatchesRes.data ?? []
  const company = companyRes.data

  const totalIntake = intakes.reduce((s, i) => s + (i.qty ?? 0), 0)
  const totalDispatched = dispatches.reduce((s, d) => s + (d.qty ?? 0), 0)
  const binsReady = bins.filter(b => b.status === 'ready').length
  const binsDrying = bins.filter(b => b.status === 'drying').length
  const activeBins = bins.filter(b => b.status !== 'empty' && b.current_moisture != null)
  const avgMoisture = activeBins.length
    ? (activeBins.reduce((s, b) => s + (b.current_moisture ?? 0), 0) / activeBins.length).toFixed(1)
    : null

  const today = new Date()
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const kpis = [
    {
      icon: '🌽',
      value: totalIntake > 0 ? `${totalIntake.toFixed(1)}T` : '0.0',
      label: 'Total Intake (T)',
      sub: 'This season',
      color: 'border-t-amber-400',
    },
    {
      icon: '✅',
      value: binsReady,
      label: 'Bins Ready',
      sub: `of ${company?.bin_count ?? 20}`,
      color: 'border-t-green-400',
    },
    {
      icon: '🔥',
      value: binsDrying,
      label: 'Drying',
      sub: 'Active',
      color: 'border-t-orange-400',
    },
    {
      icon: '📦',
      value: dispatches.length,
      label: 'Dispatches',
      sub: 'Verified',
      color: 'border-t-blue-400',
    },
    {
      icon: '💧',
      value: avgMoisture ? `${avgMoisture}%` : '—',
      label: 'Avg Moisture',
      sub: 'Active bins',
      color: 'border-t-cyan-400',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Operations Center</div>
          <h1 className="text-3xl font-bold text-gray-900">{greeting} — Here&apos;s your plant status</h1>
          <p className="text-gray-400 mt-1">{dateStr}</p>
        </div>
        <a href="/analytics" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2.5 rounded-xl hover:shadow-sm transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Analytics
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {kpis.map(k => (
          <div key={k.label} className={`bg-white rounded-2xl border border-gray-100 border-t-4 ${k.color} p-5 shadow-sm`}>
            <div className="text-2xl mb-3">{k.icon}</div>
            <div className="text-2xl font-bold text-gray-900 tabular-nums">{k.value}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">{k.label}</div>
            <div className="text-xs text-gray-300 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Bin Overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-gray-900">Bin Overview</h2>
            <p className="text-sm text-gray-400 mt-0.5">All {company?.bin_count ?? 20} drying chambers — click any bin to update</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <span key={key} className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {bins.map(bin => <BinCard key={bin.id} bin={bin} />)}
          {bins.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-300">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              <p className="mt-3 text-sm">No bins found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

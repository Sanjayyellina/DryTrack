'use client'

import { useState, useTransition } from 'react'
import { updateBin, emptyBin, changeBinStatus, saveMoistureRound } from '@/actions/bins'
import type { Bin, MoistureReading } from '@/types/database'

const STATUS_CONFIG: Record<string, { label: string; bg: string; border: string; text: string; dot: string }> = {
  empty:    { label: 'Empty',    bg: 'bg-gray-50',     border: 'border-gray-200',  text: 'text-gray-400',  dot: 'bg-gray-300'   },
  intake:   { label: 'Intake',   bg: 'bg-amber-50',    border: 'border-amber-200', text: 'text-amber-600', dot: 'bg-amber-400'  },
  drying:   { label: 'Drying',   bg: 'bg-orange-50',   border: 'border-orange-200',text: 'text-orange-600',dot: 'bg-orange-400' },
  ready:    { label: 'Ready',    bg: 'bg-green-50',    border: 'border-green-200', text: 'text-green-600', dot: 'bg-green-400'  },
  shelling: { label: 'Shelling', bg: 'bg-purple-50',   border: 'border-purple-200',text: 'text-purple-600',dot: 'bg-purple-400' },
}

export default function BinsClient({
  bins,
  moistureHistory,
}: {
  bins: Bin[]
  moistureHistory: Pick<MoistureReading, 'bin_id' | 'moisture' | 'airflow' | 'recorded_at'>[]
}) {
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null)
  const [moistureMode, setMoistureMode] = useState(false)
  const [moistureInputs, setMoistureInputs] = useState<Record<number, string>>({})
  const [isPending, startTransition] = useTransition()
  const [filter, setFilter] = useState<string>('all')

  const activeBins = bins.filter(b => b.status !== 'empty')
  const filteredBins = filter === 'all' ? bins : bins.filter(b => b.status === filter)

  function getHistory(binId: number) {
    return moistureHistory
      .filter(m => m.bin_id === binId)
      .slice(0, 10)
      .reverse()
  }

  function getDryingDays(bin: Bin) {
    if (!bin.intake_date_ts) return null
    const ms = Date.now() - parseInt(bin.intake_date_ts)
    return Math.floor(ms / (1000 * 60 * 60 * 24))
  }

  function getMoistureRate(binId: number) {
    const history = getHistory(binId)
    if (history.length < 2) return null
    const first = history[0]
    const last = history[history.length - 1]
    const hours = (new Date(last.recorded_at).getTime() - new Date(first.recorded_at).getTime()) / (1000 * 60 * 60)
    if (hours < 1) return null
    return ((first.moisture - last.moisture) / hours).toFixed(2)
  }

  function handleBinUpdate(formData: FormData) {
    startTransition(async () => {
      await updateBin(formData)
      setSelectedBin(null)
    })
  }

  function handleEmpty(binId: number) {
    if (!confirm('Empty this bin? A snapshot will be saved to history.')) return
    startTransition(async () => {
      await emptyBin(binId)
      setSelectedBin(null)
    })
  }

  function handleStatusChange(binId: number, status: string) {
    startTransition(async () => {
      await changeBinStatus(binId, status)
      setSelectedBin(null)
    })
  }

  function handleMoistureRound() {
    const readings = activeBins
      .filter(b => moistureInputs[b.id])
      .map(b => ({
        bin_id: b.id,
        moisture: parseFloat(moistureInputs[b.id]),
        airflow: b.airflow ?? 'up',
      }))
      .filter(r => !isNaN(r.moisture))

    if (readings.length === 0) return
    startTransition(async () => {
      await saveMoistureRound(readings)
      setMoistureMode(false)
      setMoistureInputs({})
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bin Monitor</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {activeBins.length} active of {bins.length} total chambers
          </p>
        </div>
        <div className="flex items-center gap-3">
          {moistureMode ? (
            <>
              <button
                onClick={() => { setMoistureMode(false); setMoistureInputs({}) }}
                className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleMoistureRound}
                disabled={isPending}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {isPending ? 'Saving...' : 'Save All Readings'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setMoistureMode(true)}
              className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#C8821A] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              Moisture Round
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {['all', ...Object.keys(STATUS_CONFIG)].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {f === 'all' ? `All (${bins.length})` : `${STATUS_CONFIG[f].label} (${bins.filter(b => b.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Moisture Round Mode */}
      {moistureMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-amber-800 mb-3">Moisture Round — Enter readings for active bins</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {activeBins.map(bin => (
              <div key={bin.id} className="bg-white rounded-xl border border-amber-200 p-3">
                <div className="text-xs font-bold text-gray-500 mb-1">BIN-{bin.bin_number}</div>
                <div className="text-xs text-gray-400 mb-2">
                  Current: {bin.current_moisture != null ? `${bin.current_moisture}%` : '—'}
                </div>
                <input
                  type="number"
                  step="0.1"
                  placeholder="New %"
                  value={moistureInputs[bin.id] ?? ''}
                  onChange={e => setMoistureInputs(prev => ({ ...prev, [bin.id]: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center font-mono focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bin Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredBins.map(bin => {
          const cfg = STATUS_CONFIG[bin.status] ?? STATUS_CONFIG.empty
          const days = getDryingDays(bin)
          const rate = getMoistureRate(bin.id)

          return (
            <button
              key={bin.id}
              onClick={() => setSelectedBin(bin)}
              className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-4 text-left hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 tracking-wide">BIN-{bin.bin_number}</span>
                <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              </div>

              {bin.status === 'empty' ? (
                <div className="text-sm text-gray-300 font-medium">Empty</div>
              ) : (
                <>
                  <div className="text-sm font-semibold text-gray-800 truncate">{bin.hybrid ?? '—'}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">{bin.qty ? `${bin.qty}T` : '—'}</span>
                    <span className={`text-sm font-bold ${cfg.text} tabular-nums`}>
                      {bin.current_moisture != null ? `${bin.current_moisture}%` : '—'}
                    </span>
                  </div>
                  {bin.current_moisture != null && (
                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (bin.current_moisture / 30) * 100)}%`,
                          backgroundColor: bin.current_moisture <= 12 ? '#22c55e' : bin.current_moisture <= 16 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    {days != null && <span className="text-[10px] text-gray-400">Day {days}</span>}
                    {rate && <span className="text-[10px] text-gray-400">{rate}%/hr</span>}
                  </div>
                </>
              )}

              <div className={`mt-2 text-[10px] font-semibold uppercase tracking-wide ${cfg.text}`}>
                {cfg.label}
              </div>
            </button>
          )
        })}
      </div>

      {/* Bin Detail Modal */}
      {selectedBin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">BIN-{selectedBin.bin_number}</h2>
                <span className={`text-xs font-semibold ${(STATUS_CONFIG[selectedBin.status] ?? STATUS_CONFIG.empty).text}`}>
                  {(STATUS_CONFIG[selectedBin.status] ?? STATUS_CONFIG.empty).label}
                </span>
              </div>
              <button onClick={() => setSelectedBin(null)} className="text-gray-300 hover:text-gray-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {selectedBin.status !== 'empty' ? (
              <div className="p-6">
                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase">Hybrid</div>
                    <div className="text-sm font-bold text-gray-900 mt-1">{selectedBin.hybrid ?? '—'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase">Quantity</div>
                    <div className="text-sm font-bold text-gray-900 mt-1">{selectedBin.qty ? `${selectedBin.qty}T` : '—'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase">Entry Moisture</div>
                    <div className="text-sm font-bold text-gray-900 mt-1">{selectedBin.entry_moisture ? `${selectedBin.entry_moisture}%` : '—'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase">Current Moisture</div>
                    <div className="text-sm font-bold text-gray-900 mt-1">{selectedBin.current_moisture != null ? `${selectedBin.current_moisture}%` : '—'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase">Airflow</div>
                    <div className="text-sm font-bold text-gray-900 mt-1 capitalize">{selectedBin.airflow ?? 'Up'}-air</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase">Intake Date</div>
                    <div className="text-sm font-bold text-gray-900 mt-1">{selectedBin.intake_date ?? '—'}</div>
                  </div>
                </div>

                {/* Moisture History */}
                {getHistory(selectedBin.id).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Moisture History</h3>
                    <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                      {getHistory(selectedBin.id).map((m, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">
                            {new Date(m.recorded_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="font-mono font-bold text-gray-700">{m.moisture}%</span>
                          <span className="text-gray-400 capitalize">{m.airflow ?? '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Update Form */}
                <form action={handleBinUpdate} className="space-y-3">
                  <input type="hidden" name="bin_id" value={selectedBin.id} />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">New Moisture %</label>
                      <input name="current_moisture" type="number" step="0.1" placeholder={selectedBin.current_moisture?.toString()} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F5A623]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Airflow</label>
                      <select name="airflow" defaultValue={selectedBin.airflow ?? 'up'} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F5A623]">
                        <option value="up">Up-air</option>
                        <option value="down">Down-air</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Notes</label>
                    <input name="notes" type="text" defaultValue={selectedBin.notes ?? ''} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F5A623]" />
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2.5 bg-[#F5A623] hover:bg-[#C8821A] text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isPending ? 'Saving...' : 'Update Bin'}
                  </button>
                </form>

                {/* Status Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase mb-2">Change Status</div>
                  <div className="flex flex-wrap gap-2">
                    {['intake', 'drying', 'ready', 'shelling'].filter(s => s !== selectedBin.status).map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedBin.id, s)}
                        disabled={isPending}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${STATUS_CONFIG[s].border} ${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text} hover:shadow-sm`}
                      >
                        {STATUS_CONFIG[s].label}
                      </button>
                    ))}
                    <button
                      onClick={() => handleEmpty(selectedBin.id)}
                      disabled={isPending}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 bg-red-50 text-red-600 hover:shadow-sm"
                    >
                      Empty Bin
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-300 py-12">
                <p>This bin is empty</p>
                <p className="text-xs mt-1">Create an intake to allocate grain to this bin</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

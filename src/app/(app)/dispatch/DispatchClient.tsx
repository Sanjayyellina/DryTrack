'use client'

import { useState, useTransition } from 'react'
import { createDispatch } from '@/actions/dispatch'
import type { Dispatch, Bin, BinAllocation } from '@/types/database'

export default function DispatchClient({
  dispatches,
  bins,
}: {
  dispatches: Dispatch[]
  bins: Pick<Bin, 'id' | 'bin_number' | 'status' | 'hybrid' | 'qty' | 'current_moisture'>[]
}) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [successReceipt, setSuccessReceipt] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const readyBins = bins.filter(b => b.status === 'ready')

  const filtered = dispatches.filter(d => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      d.receipt_id?.toLowerCase().includes(q) ||
      d.buyer_name?.toLowerCase().includes(q) ||
      d.vehicle_no?.toLowerCase().includes(q) ||
      d.hybrid?.toLowerCase().includes(q)
    )
  })

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccessReceipt(null)
    startTransition(async () => {
      const result = await createDispatch(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccessReceipt(result.receipt_id ?? null)
        setShowForm(false)
      }
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispatch</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {dispatches.length} dispatches | {readyBins.length} bins ready
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={readyBins.length === 0}
          className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#C8821A] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          New Dispatch
        </button>
      </div>

      {/* Success Toast */}
      {successReceipt && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center justify-between">
          <span>Dispatch created! Receipt: <strong>{successReceipt}</strong></span>
          <button onClick={() => setSuccessReceipt(null)} className="text-green-400 hover:text-green-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by receipt, buyer, vehicle..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]"
        />
      </div>

      {/* Dispatch Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Receipt ID</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Buyer</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Vehicle</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Hybrid</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Qty (T)</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Bins</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const binList = (d.bins as BinAllocation[] | null)?.map(b => `BIN-${b.bin_number}`).join(', ') ?? '—'
                return (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      {new Date(d.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-semibold">
                        {d.receipt_id}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">{d.buyer_name || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-600">{d.vehicle_no || '—'}</td>
                    <td className="px-5 py-3.5">
                      {d.hybrid ? (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                          {d.hybrid}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-semibold text-gray-900">{d.qty ?? '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{binList}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-300">
                    {search ? 'No matching dispatches' : 'No dispatches yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Dispatch Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">New Dispatch</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-300 hover:text-gray-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form action={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              {/* Ready bins selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Select Bins to Dispatch ({readyBins.length} ready)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {readyBins.map(bin => (
                    <label
                      key={bin.id}
                      className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-green-400 hover:bg-green-50 has-[:checked]:border-green-400 has-[:checked]:bg-green-50 transition-colors"
                    >
                      <input type="checkbox" name="bin_ids" value={bin.id} className="mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-gray-900">BIN-{bin.bin_number}</div>
                        <div className="text-xs text-gray-500">{bin.hybrid ?? '—'} | {bin.qty ?? 0}T | {bin.current_moisture ?? '—'}%</div>
                      </div>
                    </label>
                  ))}
                </div>
                {readyBins.length === 0 && (
                  <div className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4 text-center">No bins are in &quot;Ready&quot; status</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Buyer Name</label>
                  <input name="buyer_name" type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Vehicle No</label>
                  <input name="vehicle_no" type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Driver Name</label>
                  <input name="driver_name" type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Signed By</label>
                  <input name="signed_by" type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
                <textarea name="notes" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] resize-none" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Creating...' : 'Create Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

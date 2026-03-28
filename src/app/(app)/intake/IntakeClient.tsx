'use client'

import { useState, useTransition } from 'react'
import { createIntake } from '@/actions/intake'
import type { Intake, Bin } from '@/types/database'

interface Allocation {
  intake_id: number
  bin_id: number
  qty: number | null
  bins: { bin_number: number } | { bin_number: number }[] | null
}

export default function IntakeClient({
  intakes,
  bins,
  allocations,
}: {
  intakes: Intake[]
  bins: Pick<Bin, 'id' | 'bin_number' | 'status' | 'hybrid'>[]
  allocations: Allocation[]
}) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const emptyBins = bins.filter(b => b.status === 'empty')

  const filtered = intakes.filter(i => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      i.challan_no?.toLowerCase().includes(q) ||
      i.vehicle_no?.toLowerCase().includes(q) ||
      i.farmer_name?.toLowerCase().includes(q) ||
      i.hybrid?.toLowerCase().includes(q)
    )
  })

  function getAllocationsFor(intakeId: number) {
    return allocations
      .filter(a => a.intake_id === intakeId)
      .map(a => {
        const b = a.bins
        if (!b) return 'BIN-?'
        const num = Array.isArray(b) ? b[0]?.bin_number : b.bin_number
        return `BIN-${num ?? '?'}`
      })
      .join(', ')
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await createIntake(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setShowForm(false)
      }
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Intake Register</h1>
          <p className="text-sm text-gray-400 mt-0.5">{intakes.length} total records</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#C8821A] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Intake
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by challan, vehicle, farmer, hybrid..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]"
        />
      </div>

      {/* Intake Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Challan</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Vehicle</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Farmer</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Hybrid</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Qty (T)</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Moisture</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Bins</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(intake => (
                <tr key={intake.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {new Date(intake.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-gray-900">{intake.challan_no || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-600">{intake.vehicle_no || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-600">{intake.farmer_name || '—'}</td>
                  <td className="px-5 py-3.5">
                    {intake.hybrid ? (
                      <span className="inline-flex px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                        {intake.hybrid}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-semibold text-gray-900">{intake.qty ?? '—'}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-gray-600">{intake.entry_moisture ? `${intake.entry_moisture}%` : '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{getAllocationsFor(intake.id) || '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-300">
                    {search ? 'No matching intakes found' : 'No intakes yet — create your first one'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Intake Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">New Intake</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-300 hover:text-gray-500 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form action={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Challan No</label>
                  <input name="challan_no" type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Vehicle No</label>
                  <input name="vehicle_no" type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Farmer Name</label>
                <input name="farmer_name" type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Hybrid</label>
                  <input name="hybrid" type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Quantity (T)</label>
                  <input name="qty" type="number" step="0.1" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Moisture %</label>
                  <input name="entry_moisture" type="number" step="0.1" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Allocate to Bins ({emptyBins.length} empty)
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1">
                  {bins.map(bin => {
                    const isEmpty = bin.status === 'empty'
                    return (
                      <label
                        key={bin.id}
                        className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                          isEmpty
                            ? 'border-gray-200 hover:border-[#F5A623] hover:bg-amber-50 has-[:checked]:border-[#F5A623] has-[:checked]:bg-amber-50 has-[:checked]:text-[#C8821A]'
                            : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="bin_ids"
                          value={bin.id}
                          disabled={!isEmpty}
                          className="sr-only"
                        />
                        BIN-{bin.bin_number}
                      </label>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
                <textarea name="notes" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] resize-none" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 bg-[#F5A623] hover:bg-[#C8821A] text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Intake'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { createCompany } from '@/actions/onboarding'

export default function OnboardingPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [companyName, setCompanyName] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await createCompany(new FormData(e.currentTarget))
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1923] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F5A623] mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Set up your facility</h1>
          <p className="text-sm text-white/40 mt-1">This takes less than a minute</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 px-2">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= s ? 'bg-[#F5A623] text-white' : 'bg-white/10 text-white/30'
              }`}>{s}</div>
              {s < 2 && <div className={`flex-1 h-px transition-colors ${step > s ? 'bg-[#F5A623]' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">

          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Company details</h2>
              <p className="text-sm text-white/40 mb-6">Tell us about your seed processing facility</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Yellina Seeds Pvt. Ltd."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sathupally, Telangana"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] transition"
                  />
                </div>
                <button
                  onClick={() => companyName.trim() && setStep(2)}
                  disabled={!companyName.trim()}
                  className="w-full bg-[#F5A623] hover:bg-[#C8821A] disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-colors"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-semibold text-white mb-1">Facility setup</h2>
              <p className="text-sm text-white/40 mb-6">Configure your drying operation</p>

              <input type="hidden" name="name" value={companyName} />

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                    Number of Drying Bins
                  </label>
                  <select
                    name="bin_count"
                    defaultValue="20"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] transition"
                  >
                    {[5, 10, 15, 20, 25, 30, 40, 50].map(n => (
                      <option key={n} value={n} className="bg-[#0F1923]">{n} bins</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                    Language
                  </label>
                  <select
                    name="language"
                    defaultValue="en"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] transition"
                  >
                    <option value="en" className="bg-[#0F1923]">English</option>
                    <option value="hi" className="bg-[#0F1923]">हिंदी (Hindi)</option>
                    <option value="te" className="bg-[#0F1923]">తెలుగు (Telugu)</option>
                  </select>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-medium rounded-xl py-3 text-sm transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#F5A623] hover:bg-[#C8821A] disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
                  >
                    {loading ? 'Setting up...' : 'Launch Dashboard →'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Trial badge */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/30">30-day free trial — no credit card required</span>
        </div>
      </div>
    </div>
  )
}

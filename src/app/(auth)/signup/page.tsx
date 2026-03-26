'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/actions/auth'

export default function SignupPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value
    const confirm = (e.currentTarget.elements.namedItem('confirm') as HTMLInputElement).value
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    const result = await signup(new FormData(e.currentTarget))
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1923] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F5A623] mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">DryTrack</h1>
          <p className="text-sm text-white/40 mt-1">Seed Operations Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
          <h2 className="text-lg font-semibold text-white mb-1">Create account</h2>
          <p className="text-sm text-white/40 mb-6">Start your 30-day free trial</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                name="confirm"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] transition"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F5A623] hover:bg-[#C8821A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-colors"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-white/30 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#F5A623] hover:text-[#C8821A] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

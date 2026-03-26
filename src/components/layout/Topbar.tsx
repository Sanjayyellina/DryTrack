'use client'

import { useState, useEffect } from 'react'

export default function Topbar({ userEmail, companyName }: { userEmail: string; companyName: string }) {
  const [time, setTime] = useState('')
  const [isOnline, setIsOnline] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    setIsOnline(navigator.onLine)
    const onOnline = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => { clearInterval(id); window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline) }
  }, [])

  const initial = userEmail?.[0]?.toUpperCase() ?? 'U'

  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-white border-b border-gray-100 flex items-center px-6 z-30 gap-4">

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search challan, vehicle, hybrid, receipt..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-600 placeholder:text-gray-300 focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] transition"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 font-mono bg-gray-100 px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">

        {/* Status */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
          isOnline ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
          {isOnline ? 'Live' : 'Offline'}
        </div>

        {/* Clock */}
        <div className="text-sm font-mono text-gray-400 tabular-nums hidden sm:block">{time}</div>

        {/* New Intake */}
        <button className="flex items-center gap-1.5 bg-[#F5A623] hover:bg-[#C8821A] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Intake
        </button>

        {/* Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 rounded-full bg-[#F5A623] text-white font-bold text-sm flex items-center justify-center hover:bg-[#C8821A] transition-colors"
          >
            {initial}
          </button>
          {showMenu && (
            <div className="absolute right-0 top-12 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-50">
                <div className="text-sm font-semibold text-gray-900 truncate">{companyName}</div>
                <div className="text-xs text-gray-400 truncate">{userEmail}</div>
              </div>
              <a href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Settings
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

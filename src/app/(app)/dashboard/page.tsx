import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: companyUser } = await supabase
    .from('company_users')
    .select('*, companies(*)')
    .eq('user_id', user.id)
    .single()

  if (!companyUser) redirect('/onboarding')

  const company = companyUser.companies as { name: string }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F5A623] mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to DryTrack</h1>
        <p className="text-gray-500 mt-2 text-lg">{company.name}</p>
        <div className="mt-6 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-green-700 font-medium">Database connected — ready to build</span>
        </div>
        <p className="text-sm text-gray-400 mt-8">Full dashboard coming next...</p>
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: companyUser } = await supabase
    .from('company_users')
    .select('role, companies(name)')
    .eq('user_id', user.id)
    .single()

  if (!companyUser) redirect('/onboarding')

  const company = (companyUser.companies as unknown) as { name: string }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar companyName={company.name} />
      <Topbar userEmail={user.email ?? ''} companyName={company.name} />
      <main className="ml-60 pt-16 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

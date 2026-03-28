import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import IntakeClient from './IntakeClient'

export default async function IntakePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [intakesRes, binsRes, allocRes] = await Promise.all([
    supabase.from('intakes').select('*').order('created_at', { ascending: false }),
    supabase.from('bins').select('id, bin_number, status, hybrid').order('bin_number'),
    supabase.from('intake_allocations').select('intake_id, bin_id, qty, bins(bin_number)'),
  ])

  return (
    <IntakeClient
      intakes={intakesRes.data ?? []}
      bins={binsRes.data ?? []}
      allocations={allocRes.data ?? []}
    />
  )
}

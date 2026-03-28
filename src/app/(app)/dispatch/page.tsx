import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DispatchClient from './DispatchClient'

export default async function DispatchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [dispatchesRes, binsRes] = await Promise.all([
    supabase.from('dispatches').select('*').order('created_at', { ascending: false }),
    supabase.from('bins').select('id, bin_number, status, hybrid, qty, current_moisture').order('bin_number'),
  ])

  return (
    <DispatchClient
      dispatches={dispatchesRes.data ?? []}
      bins={binsRes.data ?? []}
    />
  )
}

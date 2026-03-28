import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BinsClient from './BinsClient'

export default async function BinsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [binsRes, moistureRes] = await Promise.all([
    supabase.from('bins').select('*').order('bin_number'),
    supabase.from('moisture_readings').select('bin_id, moisture, airflow, recorded_at').order('recorded_at', { ascending: false }).limit(500),
  ])

  return (
    <BinsClient
      bins={binsRes.data ?? []}
      moistureHistory={moistureRes.data ?? []}
    />
  )
}

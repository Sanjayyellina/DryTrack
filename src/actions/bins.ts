'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateBin(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: cu } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (!cu) return { error: 'No company found' }

  const bin_id = parseInt(formData.get('bin_id') as string)
  const current_moisture = parseFloat(formData.get('current_moisture') as string) || null
  const airflow = formData.get('airflow') as string || null
  const status = formData.get('status') as string || null
  const notes = formData.get('notes') as string || null

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (current_moisture !== null) updates.current_moisture = current_moisture
  if (airflow) updates.airflow = airflow
  if (status) updates.status = status
  if (notes !== null) updates.notes = notes

  const { error } = await supabase
    .from('bins')
    .update(updates)
    .eq('id', bin_id)

  if (error) return { error: error.message }

  // Save moisture reading
  if (current_moisture !== null) {
    await supabase.from('moisture_readings').insert({
      company_id: cu.company_id,
      bin_id,
      moisture: current_moisture,
      airflow,
    })
  }

  // Log activity
  await supabase.from('activity_log').insert({
    company_id: cu.company_id,
    user_id: user.id,
    action: 'bin_updated',
    details: { bin_id, ...updates },
  })

  revalidatePath('/bins')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function saveMoistureRound(readings: { bin_id: number; moisture: number; airflow: string }[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: cu } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (!cu) return { error: 'No company found' }

  for (const r of readings) {
    // Update bin moisture
    await supabase
      .from('bins')
      .update({
        current_moisture: r.moisture,
        airflow: r.airflow,
        updated_at: new Date().toISOString(),
      })
      .eq('id', r.bin_id)

    // Insert moisture reading
    await supabase.from('moisture_readings').insert({
      company_id: cu.company_id,
      bin_id: r.bin_id,
      moisture: r.moisture,
      airflow: r.airflow,
    })
  }

  await supabase.from('activity_log').insert({
    company_id: cu.company_id,
    user_id: user.id,
    action: 'moisture_round',
    details: { readings_count: readings.length },
  })

  revalidatePath('/bins')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function emptyBin(binId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: cu } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (!cu) return { error: 'No company found' }

  // Get current bin state for snapshot
  const { data: bin } = await supabase
    .from('bins')
    .select('*')
    .eq('id', binId)
    .single()

  if (!bin) return { error: 'Bin not found' }

  // Save snapshot to bin_history
  await supabase.from('bin_history').insert({
    company_id: cu.company_id,
    bin_id: binId,
    snapshot: bin,
    emptied_by: user.id,
  })

  // Reset bin
  await supabase
    .from('bins')
    .update({
      status: 'empty',
      hybrid: null,
      qty: null,
      entry_moisture: null,
      current_moisture: null,
      intake_date: null,
      intake_date_ts: null,
      airflow: 'up',
      notes: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', binId)

  await supabase.from('activity_log').insert({
    company_id: cu.company_id,
    user_id: user.id,
    action: 'bin_emptied',
    details: { bin_id: binId, bin_number: bin.bin_number },
  })

  revalidatePath('/bins')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function changeBinStatus(binId: number, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('bins')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', binId)

  if (error) return { error: error.message }

  revalidatePath('/bins')
  revalidatePath('/dashboard')
  return { success: true }
}

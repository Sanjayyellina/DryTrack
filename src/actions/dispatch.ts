'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function generateReceiptId(): string {
  const year = new Date().getFullYear()
  const counter = Math.floor(100000 + Math.random() * 900000)
  return `DT-${year}-${counter}`
}

export async function createDispatch(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: cu } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (!cu) return { error: 'No company found' }

  const buyer_name = formData.get('buyer_name') as string || null
  const vehicle_no = formData.get('vehicle_no') as string || null
  const driver_name = formData.get('driver_name') as string || null
  const notes = formData.get('notes') as string || null
  const signed_by = formData.get('signed_by') as string || null
  const bin_ids = formData.getAll('bin_ids') as string[]

  if (bin_ids.length === 0) return { error: 'Select at least one bin' }

  // Get bin details for dispatch record
  const { data: bins } = await supabase
    .from('bins')
    .select('id, bin_number, hybrid, qty, current_moisture')
    .in('id', bin_ids.map(Number))

  if (!bins || bins.length === 0) return { error: 'Bins not found' }

  const binAllocations = bins.map(b => ({
    bin_number: b.bin_number,
    hybrid: b.hybrid ?? '',
    qty: b.qty ?? 0,
  }))

  const totalQty = bins.reduce((s, b) => s + (b.qty ?? 0), 0)
  const primaryHybrid = bins[0]?.hybrid ?? null
  const receipt_id = generateReceiptId()

  const { data: dispatch, error: dispatchErr } = await supabase
    .from('dispatches')
    .insert({
      company_id: cu.company_id,
      receipt_id,
      buyer_name,
      vehicle_no,
      hybrid: primaryHybrid,
      qty: totalQty,
      bins: binAllocations,
      driver_name,
      notes,
      signed_by,
    })
    .select()
    .single()

  if (dispatchErr) return { error: dispatchErr.message }

  // Empty the dispatched bins (save history + reset)
  for (const bin of bins) {
    // Save snapshot
    const { data: fullBin } = await supabase
      .from('bins')
      .select('*')
      .eq('id', bin.id)
      .single()

    if (fullBin) {
      await supabase.from('bin_history').insert({
        company_id: cu.company_id,
        bin_id: bin.id,
        snapshot: fullBin,
        emptied_by: user.id,
      })
    }

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
      .eq('id', bin.id)
  }

  // Log activity
  await supabase.from('activity_log').insert({
    company_id: cu.company_id,
    user_id: user.id,
    action: 'dispatch_created',
    details: { dispatch_id: dispatch.id, receipt_id, buyer_name, qty: totalQty, bin_count: bins.length },
  })

  revalidatePath('/dispatch')
  revalidatePath('/dashboard')
  revalidatePath('/bins')
  return { success: true, receipt_id }
}

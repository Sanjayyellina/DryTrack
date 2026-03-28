'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createIntake(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get user's company
  const { data: cu } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (!cu) return { error: 'No company found' }

  const challan_no = formData.get('challan_no') as string || null
  const vehicle_no = formData.get('vehicle_no') as string || null
  const farmer_name = formData.get('farmer_name') as string || null
  const hybrid = formData.get('hybrid') as string || null
  const qty = parseFloat(formData.get('qty') as string) || null
  const entry_moisture = parseFloat(formData.get('entry_moisture') as string) || null
  const notes = formData.get('notes') as string || null
  const bin_ids = formData.getAll('bin_ids') as string[]

  // Insert intake
  const { data: intake, error: intakeErr } = await supabase
    .from('intakes')
    .insert({ company_id: cu.company_id, challan_no, vehicle_no, farmer_name, hybrid, qty, entry_moisture, notes })
    .select()
    .single()

  if (intakeErr) return { error: intakeErr.message }

  // Allocate to bins
  if (bin_ids.length > 0 && qty) {
    const qtyPerBin = qty / bin_ids.length

    // Insert allocations
    const allocations = bin_ids.map(bid => ({
      company_id: cu.company_id,
      intake_id: intake.id,
      bin_id: parseInt(bid),
      qty: Math.round(qtyPerBin * 100) / 100,
    }))
    await supabase.from('intake_allocations').insert(allocations)

    // Update each bin
    const now = Date.now().toString()
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

    for (const bid of bin_ids) {
      await supabase
        .from('bins')
        .update({
          status: 'intake',
          hybrid,
          qty: qtyPerBin,
          entry_moisture,
          current_moisture: entry_moisture,
          intake_date: today,
          intake_date_ts: now,
          updated_at: new Date().toISOString(),
        })
        .eq('id', parseInt(bid))
    }
  }

  // Log activity
  await supabase.from('activity_log').insert({
    company_id: cu.company_id,
    user_id: user.id,
    action: 'intake_created',
    details: { intake_id: intake.id, challan_no, hybrid, qty, bins: bin_ids },
  })

  revalidatePath('/intake')
  revalidatePath('/dashboard')
  revalidatePath('/bins')
  return { success: true, intake_id: intake.id }
}

export async function deleteIntake(intakeId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get allocations to reset bins
  const { data: allocations } = await supabase
    .from('intake_allocations')
    .select('bin_id')
    .eq('intake_id', intakeId)

  if (allocations) {
    for (const alloc of allocations) {
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
          notes: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', alloc.bin_id)
    }
  }

  await supabase.from('intake_allocations').delete().eq('intake_id', intakeId)
  await supabase.from('intakes').delete().eq('id', intakeId)

  revalidatePath('/intake')
  revalidatePath('/dashboard')
  revalidatePath('/bins')
  return { success: true }
}

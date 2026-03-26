'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createCompany(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const binCount = parseInt(formData.get('bin_count') as string) || 20
  const language = formData.get('language') as string || 'en'

  // Generate slug from company name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  // Create company
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .insert({ name, slug, bin_count: binCount, language })
    .select()
    .single()

  if (companyError) return { error: companyError.message }

  // Link user to company as admin
  const { error: userError } = await supabase
    .from('company_users')
    .insert({ company_id: company.id, user_id: user.id, role: 'admin' })

  if (userError) return { error: userError.message }

  // Create bins for this company
  const bins = Array.from({ length: binCount }, (_, i) => ({
    company_id: company.id,
    bin_number: i + 1,
    status: 'empty' as const,
  }))

  await supabase.from('bins').insert(bins)

  // Create trial subscription
  const trialEnd = new Date()
  trialEnd.setDate(trialEnd.getDate() + 30)

  await supabase.from('subscriptions').insert({
    company_id: company.id,
    plan: 'trial',
    status: 'trialing',
    trial_ends_at: trialEnd.toISOString(),
  })

  redirect('/dashboard')
}

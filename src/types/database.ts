export type UserRole = 'admin' | 'manager' | 'operator'
export type BinStatus = 'empty' | 'intake' | 'drying' | 'ready' | 'shelling'
export type Airflow = 'up' | 'down'
export type MaintenanceStatus = 'open' | 'in_progress' | 'resolved'
export type MaintenancePriority = 'low' | 'medium' | 'high'
export type SubscriptionPlan = 'trial' | 'basic' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trialing'

export interface Company {
  id: string
  name: string
  slug: string
  domain: string | null
  logo_url: string | null
  brand_color: string
  bin_count: number
  language: string
  created_at: string
}

export interface CompanyUser {
  id: string
  company_id: string
  user_id: string
  role: UserRole
  created_at: string
}

export interface Bin {
  id: number
  company_id: string
  bin_number: number
  status: BinStatus
  hybrid: string | null
  qty: number | null
  entry_moisture: number | null
  current_moisture: number | null
  airflow: Airflow
  intake_date: string | null
  intake_date_ts: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Intake {
  id: number
  company_id: string
  challan_no: string | null
  vehicle_no: string | null
  farmer_name: string | null
  hybrid: string | null
  qty: number | null
  entry_moisture: number | null
  notes: string | null
  created_at: string
}

export interface IntakeAllocation {
  id: number
  company_id: string
  intake_id: number
  bin_id: number
  qty: number | null
  created_at: string
}

export interface Dispatch {
  id: number
  company_id: string
  receipt_id: string
  buyer_name: string | null
  vehicle_no: string | null
  hybrid: string | null
  qty: number | null
  bins: BinAllocation[] | null
  driver_name: string | null
  notes: string | null
  signed_by: string | null
  created_at: string
}

export interface BinAllocation {
  bin_number: number
  hybrid: string
  qty: number
}

export interface MaintenanceLog {
  id: number
  company_id: string
  bin_id: number | null
  title: string
  description: string | null
  status: MaintenanceStatus
  priority: MaintenancePriority
  resolved_at: string | null
  created_at: string
}

export interface LaborLog {
  id: number
  company_id: string
  worker_name: string
  role: string | null
  shift_start: string | null
  shift_end: string | null
  hours: number | null
  notes: string | null
  created_at: string
}

export interface BinHistory {
  id: number
  company_id: string
  bin_id: number
  snapshot: Bin
  emptied_by: string | null
  created_at: string
}

export interface MoistureReading {
  id: number
  company_id: string
  bin_id: number
  moisture: number
  airflow: string | null
  recorded_at: string
}

export interface ActivityLog {
  id: number
  company_id: string
  user_id: string | null
  action: string
  details: Record<string, unknown> | null
  created_at: string
}

export interface Subscription {
  id: string
  company_id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  trial_ends_at: string | null
  current_period_start: string | null
  current_period_end: string | null
  razorpay_subscription_id: string | null
  created_at: string
}

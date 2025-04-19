import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Export types for convenience
export type Tables = Database['public']['Tables']
export type Profile = Tables['profiles']['Row']
export type Deposit = Tables['deposits']['Row']
export type Withdrawal = Tables['withdrawals']['Row']
export type Plan = Tables['plans']['Row']
export type Token = Tables['tokens']['Row']
export type Referral = Tables['referrals']['Row'] 
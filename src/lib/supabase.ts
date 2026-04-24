import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-xyzxyzxyz.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-abc123'
  )

export const supabase = createClient()

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables.\n' +
    'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Database type helpers (re-export for convenience) ──────────────────────

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      [table: string]: {
        Row: Record<string, Json>
        Insert: Record<string, Json>
        Update: Record<string, Json>
      }
    }
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
  }
}

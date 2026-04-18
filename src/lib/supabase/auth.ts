/**
 * Supabase Auth — wrapper around @supabase/supabase-js Auth methods.
 */

import { supabase } from './client'
import type { User, Session } from '@supabase/supabase-js'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

export interface SignUpPayload {
  email: string
  password: string
  fullName?: string
}

export interface SignInPayload {
  email: string
  password: string
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function signUp({ email, password, fullName }: SignUpPayload): Promise<User> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName ?? '' } },
  })
  if (error) throw new Error(error.message)
  if (!data.user) throw new Error('Sign-up succeeded but no user returned')
  return data.user
}

export async function signIn({ email, password }: SignInPayload): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  if (!data.session) throw new Error('Sign-in succeeded but no session returned')
  return data.session
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
): () => void {
  const { data } = supabase.auth.onAuthStateChange(callback)
  return () => data.subscription.unsubscribe()
}

export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback`,
  })
  if (error) throw new Error(error.message)
}

export async function updateUserMetadata(updates: Record<string, unknown>): Promise<User> {
  const { data, error } = await supabase.auth.updateUser({ data: updates })
  if (error) throw new Error(error.message)
  if (!data.user) throw new Error('Update succeeded but no user returned')
  return data.user
}

export type { User, Session }

'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface IAuthState {
  error?: string
}

export async function login(
  _prevState: IAuthState | null,
  formData: FormData
): Promise<IAuthState | null> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function register(
  _prevState: IAuthState | null,
  formData: FormData
): Promise<IAuthState | null> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

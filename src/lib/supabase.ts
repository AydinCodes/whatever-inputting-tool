// $lib/supabase.ts
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'
import { createClient } from '@supabase/supabase-js'

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export function createAuthenticatedClient(access_token: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${access_token}` } }
  })
}
import { supabase } from './supabaseClient'

const SESSION_KEY = 'meetgov_session_token'

export const sessionGuardService = {
  // Generate a unique token for this browser tab/device
  getOrCreateToken() {
    let token = sessionStorage.getItem(SESSION_KEY)
    if (!token) {
      token = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      sessionStorage.setItem(SESSION_KEY, token)
    }
    return token
  },

  async registerSession(userId) {
    const token = this.getOrCreateToken()

    // Remove any existing sessions for this user (forces single login)
    await supabase
      .from('active_sessions')
      .delete()
      .eq('user_id', userId)

    // Register this session
    const { error } = await supabase
      .from('active_sessions')
      .insert({ user_id: userId, session_token: token })

    if (error) console.error('Session register error:', error)
    return token
  },

  async validateSession(userId) {
    const token = sessionStorage.getItem(SESSION_KEY)
    if (!token) return false

    const { data } = await supabase
      .from('active_sessions')
      .select('session_token')
      .eq('user_id', userId)
      .single()

    return data?.session_token === token
  },

  async refreshSession(userId) {
    const token = sessionStorage.getItem(SESSION_KEY)
    if (!token) return

    await supabase
      .from('active_sessions')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('session_token', token)
  },

  async clearSession(userId) {
    const token = sessionStorage.getItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    if (!userId || !token) return
    await supabase
      .from('active_sessions')
      .delete()
      .eq('user_id', userId)
      .eq('session_token', token)
  },
}
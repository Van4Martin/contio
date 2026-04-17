import { supabase } from './supabaseClient'

export const meetingService = {
  async getAllMeetings() {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('scheduled_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getMeetingById(id) {
    const { data, error } = await supabase
      .from('meetings')
      .select('*, sections(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createMeeting(meeting) {
    const { data, error } = await supabase
      .from('meetings')
      .insert(meeting)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateMeeting(id, updates) {
    const { data, error } = await supabase
      .from('meetings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteMeeting(id) {
    const { error } = await supabase.from('meetings').delete().eq('id', id)
    if (error) throw error
  },

  async getMeetingSections(meetingId) {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('order_index')
    if (error) throw error
    return data
  },
}
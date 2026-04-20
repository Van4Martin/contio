// import { supabase } from './supabaseClient'

// export const meetingService = {
//   async getAllMeetings() {
//     const { data, error } = await supabase
//       .from('meetings')
//       .select('*')
//       .order('scheduled_at', { ascending: false })
//     if (error) throw error
//     return data
//   },

//   async getMeetingById(id) {
//     const { data, error } = await supabase
//       .from('meetings')
//       .select('*, sections(*)')
//       .eq('id', id)
//       .single()
//     if (error) throw error
//     return data
//   },

//   async createMeeting(meeting) {
//     const { data, error } = await supabase
//       .from('meetings')
//       .insert(meeting)
//       .select()
//       .single()
//     if (error) throw error
//     return data
//   },

//   async updateMeeting(id, updates) {
//     const { data, error } = await supabase
//       .from('meetings')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single()
//     if (error) throw error
//     return data
//   },

//   async deleteMeeting(id) {
//     const { error } = await supabase.from('meetings').delete().eq('id', id)
//     if (error) throw error
//   },

//   async getMeetingSections(meetingId) {
//     const { data, error } = await supabase
//       .from('sections')
//       .select('*')
//       .eq('meeting_id', meetingId)
//       .order('order_index')
//     if (error) throw error
//     return data
//   },
// }




import { supabase } from './supabaseClient'

export const meetingService = {
  // ── Meetings ─────────────────────────────────────────────────
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
      .select('*, sessions(*, agenda_items(*))')
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
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async scheduleMeeting(id) {
    return this.updateMeeting(id, { status: 'scheduled' })
  },

  async activateMeeting(id) {
    return this.updateMeeting(id, { status: 'active' })
  },

  async cancelMeeting(id) {
    return this.updateMeeting(id, { status: 'cancelled' })
  },

  async endMeeting(id) {
    return this.updateMeeting(id, { status: 'completed' })
  },

  async deleteMeeting(id) {
    const { error } = await supabase.from('meetings').delete().eq('id', id)
    if (error) throw error
  },

  // ── Sessions ─────────────────────────────────────────────────
  async getSessionsByMeeting(meetingId) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('order_index')
    if (error) throw error
    return data
  },

  async getSessionById(sessionId) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, agenda_items(*), meetings(id, title, status)')
      .eq('id', sessionId)
      .single()
    if (error) throw error
    // Sort agenda items
    if (data?.agenda_items) {
      data.agenda_items.sort((a, b) => a.order_index - b.order_index)
    }
    return data
  },

  async createSession(session) {
    const { data, error } = await supabase
      .from('sessions')
      .insert(session)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateSession(id, updates) {
    const { data, error } = await supabase
      .from('sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteSession(id) {
    const { error } = await supabase.from('sessions').delete().eq('id', id)
    if (error) throw error
  },

  // Election controls
  async openElection(sessionId) {
    return this.updateSession(sessionId, { election_open: true, has_election: true })
  },

  async closeElection(sessionId, adminUserId) {
    return this.updateSession(sessionId, {
      election_open: false,
      election_closed_at: new Date().toISOString(),
      election_closed_by: adminUserId,
    })
  },

  // Attendance + motions open/close
  async toggleAttendance(sessionId, open) {
    return this.updateSession(sessionId, { attendance_open: open })
  },

  async toggleMotions(sessionId, open) {
    return this.updateSession(sessionId, { motions_open: open })
  },

  // ── Agenda Items ─────────────────────────────────────────────
  async getAgendaItems(sessionId) {
    const { data, error } = await supabase
      .from('agenda_items')
      .select('*')
      .eq('session_id', sessionId)
      .order('order_index')
    if (error) throw error
    return data
  },

  async createAgendaItem(item) {
    const { data, error } = await supabase
      .from('agenda_items')
      .insert(item)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateAgendaItem(id, updates) {
    const { data, error } = await supabase
      .from('agenda_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteAgendaItem(id) {
    const { error } = await supabase.from('agenda_items').delete().eq('id', id)
    if (error) throw error
  },
}
import { supabase } from './supabaseClient'

export const adminService = {
  async getAllUsers() {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async createSection(section) {
    const { data, error } = await supabase.from('sections').insert(section).select().single()
    if (error) throw error
    return data
  },

  async updateSection(id, updates) {
    const { data, error } = await supabase.from('sections').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async deleteSection(id) {
    const { error } = await supabase.from('sections').delete().eq('id', id)
    if (error) throw error
  },

  async createCandidate(candidate) {
    const { data, error } = await supabase.from('candidates').insert(candidate).select().single()
    if (error) throw error
    return data
  },

  async deleteCandidate(id) {
    const { error } = await supabase.from('candidates').delete().eq('id', id)
    if (error) throw error
  },

  async createMotion(motion) {
    const { data, error } = await supabase.from('motions').insert(motion).select().single()
    if (error) throw error
    return data
  },

  async updateMotion(id, updates) {
    const { data, error } = await supabase.from('motions').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async deleteMotion(id) {
    const { error } = await supabase.from('motions').delete().eq('id', id)
    if (error) throw error
  },

  async getFullResults(meetingId) {
    const [attendance, peopleVotes, motionVotes] = await Promise.all([
      supabase.from('attendance').select('*, users(full_name), sections(title)').eq('meeting_id', meetingId),
      supabase.from('votes_people').select('*, candidates(name), sections(title)').eq('meeting_id', meetingId),
      supabase.from('votes_motions').select('*, motions(title), sections(title)').eq('meeting_id', meetingId),
    ])
    if (attendance.error) throw attendance.error
    if (peopleVotes.error) throw peopleVotes.error
    if (motionVotes.error) throw motionVotes.error
    return { attendance: attendance.data, peopleVotes: peopleVotes.data, motionVotes: motionVotes.data }
  },
}
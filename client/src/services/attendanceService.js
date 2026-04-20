// import { supabase } from './supabaseClient'

// export const attendanceService = {
//   async checkIn(meetingId, sectionId, userId) {
//     const { data, error } = await supabase
//       .from('attendance')
//       .upsert({ meeting_id: meetingId, section_id: sectionId, user_id: userId, checked_in: true, checked_in_at: new Date().toISOString() })
//       .select()
//       .single()
//     if (error) throw error
//     return data
//   },

//   async getAttendance(meetingId, sectionId) {
//     const { data, error } = await supabase
//       .from('attendance')
//       .select('*, users(id, full_name, email)')
//       .eq('meeting_id', meetingId)
//       .eq('section_id', sectionId)
//     if (error) throw error
//     return data
//   },

//   async getUserAttendance(userId, meetingId) {
//     const { data, error } = await supabase
//       .from('attendance')
//       .select('*')
//       .eq('user_id', userId)
//       .eq('meeting_id', meetingId)
//     if (error) throw error
//     return data
//   },

//   async getMeetingAttendanceSummary(meetingId) {
//     const { data, error } = await supabase
//       .from('attendance')
//       .select('section_id, checked_in, users(full_name)')
//       .eq('meeting_id', meetingId)
//     if (error) throw error
//     return data
//   },
// }





import { supabase } from './supabaseClient'

export const attendanceService = {
  async checkIn(meetingId, sessionId, userId) {
    const { data, error } = await supabase
      .from('attendance')
      .upsert({
        meeting_id: meetingId,
        session_id: sessionId,
        user_id: userId,
        checked_in: true,
        checked_in_at: new Date().toISOString(),
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getAttendance(meetingId, sessionId) {
    const { data, error } = await supabase
      .from('attendance')
      .select('*, users(id, full_name, email)')
      .eq('meeting_id', meetingId)
      .eq('session_id', sessionId)
    if (error) throw error
    return data
  },

  async getUserAttendanceForMeeting(userId, meetingId) {
    const { data, error } = await supabase
      .from('attendance')
      .select('session_id, checked_in')
      .eq('user_id', userId)
      .eq('meeting_id', meetingId)
    if (error) throw error
    return data
  },
}
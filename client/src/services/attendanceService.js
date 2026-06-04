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





// import { supabase } from './supabaseClient'

// export const attendanceService = {
//   async checkIn(meetingId, sessionId, userId) {
//     const { data, error } = await supabase
//       .from('attendance')
//       .upsert({
//         meeting_id: meetingId,
//         session_id: sessionId,
//         user_id: userId,
//         checked_in: true,
//         checked_in_at: new Date().toISOString(),
//       })
//       .select()
//       .single()
//     if (error) throw error
//     return data
//   },

//   async getAttendance(meetingId, sessionId) {
//     const { data, error } = await supabase
//       .from('attendance')
//       .select('*, users(id, full_name, email)')
//       .eq('meeting_id', meetingId)
//       .eq('session_id', sessionId)
//     if (error) throw error
//     return data
//   },

//   async getUserAttendanceForMeeting(userId, meetingId) {
//     const { data, error } = await supabase
//       .from('attendance')
//       .select('session_id, checked_in')
//       .eq('user_id', userId)
//       .eq('meeting_id', meetingId)
//     if (error) throw error
//     return data
//   },
// }



import { supabase } from './supabaseClient'

export const attendanceService = {
  // Calculate distance between two coordinates in meters (Haversine formula)
  getDistanceMeters(lat1, lng1, lat2, lng2) {
    const R = 6371000 // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(Δφ/2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  },

  async verifyLocation(meeting) {
    if (!meeting.geofence_enabled) return { allowed: true }

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ allowed: false, error: 'Geolocation is not supported by your device.' })
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const distance = this.getDistanceMeters(
            latitude, longitude,
            meeting.geofence_lat, meeting.geofence_lng
          )
          if (distance <= meeting.geofence_radius_meters) {
            resolve({ allowed: true, distance: Math.round(distance) })
          } else {
            resolve({
              allowed: false,
              distance: Math.round(distance),
              error: `You are ${Math.round(distance)}m away from the meeting location. You must be within ${meeting.geofence_radius_meters}m to check in.`
            })
          }
        },
        (err) => {
          resolve({
            allowed: false,
            error: 'Location access denied. You must allow location access to check in.'
          })
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  },

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
    return data || []
  },
}
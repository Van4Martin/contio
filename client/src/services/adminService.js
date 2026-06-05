// // // import { supabase } from './supabaseClient'

// // // export const adminService = {
// // //   async getAllUsers() {
// // //     const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false })
// // //     if (error) throw error
// // //     return data
// // //   },

// // //   async createSection(section) {
// // //     const { data, error } = await supabase.from('sections').insert(section).select().single()
// // //     if (error) throw error
// // //     return data
// // //   },

// // //   async updateSection(id, updates) {
// // //     const { data, error } = await supabase.from('sections').update(updates).eq('id', id).select().single()
// // //     if (error) throw error
// // //     return data
// // //   },

// // //   async deleteSection(id) {
// // //     const { error } = await supabase.from('sections').delete().eq('id', id)
// // //     if (error) throw error
// // //   },

// // //   async createCandidate(candidate) {
// // //     const { data, error } = await supabase.from('candidates').insert(candidate).select().single()
// // //     if (error) throw error
// // //     return data
// // //   },

// // //   async deleteCandidate(id) {
// // //     const { error } = await supabase.from('candidates').delete().eq('id', id)
// // //     if (error) throw error
// // //   },

// // //   async createMotion(motion) {
// // //     const { data, error } = await supabase.from('motions').insert(motion).select().single()
// // //     if (error) throw error
// // //     return data
// // //   },

// // //   async updateMotion(id, updates) {
// // //     const { data, error } = await supabase.from('motions').update(updates).eq('id', id).select().single()
// // //     if (error) throw error
// // //     return data
// // //   },

// // //   async deleteMotion(id) {
// // //     const { error } = await supabase.from('motions').delete().eq('id', id)
// // //     if (error) throw error
// // //   },

// // //   async getFullResults(meetingId) {
// // //     const [attendance, peopleVotes, motionVotes] = await Promise.all([
// // //       supabase.from('attendance').select('*, users(full_name), sections(title)').eq('meeting_id', meetingId),
// // //       supabase.from('votes_people').select('*, candidates(name), sections(title)').eq('meeting_id', meetingId),
// // //       supabase.from('votes_motions').select('*, motions(title), sections(title)').eq('meeting_id', meetingId),
// // //     ])
// // //     if (attendance.error) throw attendance.error
// // //     if (peopleVotes.error) throw peopleVotes.error
// // //     if (motionVotes.error) throw motionVotes.error
// // //     return { attendance: attendance.data, peopleVotes: peopleVotes.data, motionVotes: motionVotes.data }
// // //   },
// // // }


// // import { supabase } from './supabaseClient'

// // export const adminService = {
// //   async getAllUsers() {
// //     const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false })
// //     if (error) throw error
// //     return data
// //   },

// //   async createSection(section) {
// //     const { data, error } = await supabase.from('sections').insert(section).select().single()
// //     if (error) throw error
// //     return data
// //   },

// //   async updateSection(id, updates) {
// //     const { data, error } = await supabase.from('sections').update(updates).eq('id', id).select().single()
// //     if (error) throw error
// //     return data
// //   },

// //   async deleteSection(id) {
// //     const { error } = await supabase.from('sections').delete().eq('id', id)
// //     if (error) throw error
// //   },

// //   // ── Categories ──────────────────────────────────────────────
// //   async getCategories(sectionId) {
// //     const { data, error } = await supabase
// //       .from('categories')
// //       .select('*, candidates(*)')
// //       .eq('section_id', sectionId)
// //       .order('order_index')
// //     if (error) throw error
// //     return data
// //   },

// //   async createCategory(category) {
// //     const { data, error } = await supabase
// //       .from('categories')
// //       .insert(category)
// //       .select()
// //       .single()
// //     if (error) throw error
// //     return data
// //   },

// //   async updateCategory(id, updates) {
// //     const { data, error } = await supabase
// //       .from('categories')
// //       .update(updates)
// //       .eq('id', id)
// //       .select()
// //       .single()
// //     if (error) throw error
// //     return data
// //   },

// //   async deleteCategory(id) {
// //     const { error } = await supabase.from('categories').delete().eq('id', id)
// //     if (error) throw error
// //   },

// //   // ── Candidates ───────────────────────────────────────────────
// //   async createCandidate(candidate) {
// //     // candidate must include category_id
// //     const { data, error } = await supabase
// //       .from('candidates')
// //       .insert(candidate)
// //       .select()
// //       .single()
// //     if (error) throw error
// //     return data
// //   },

// //   async deleteCandidate(id) {
// //     const { error } = await supabase.from('candidates').delete().eq('id', id)
// //     if (error) throw error
// //   },

// //   // ── Motions ──────────────────────────────────────────────────
// //   async createMotion(motion) {
// //     const { data, error } = await supabase.from('motions').insert(motion).select().single()
// //     if (error) throw error
// //     return data
// //   },

// //   async updateMotion(id, updates) {
// //     const { data, error } = await supabase.from('motions').update(updates).eq('id', id).select().single()
// //     if (error) throw error
// //     return data
// //   },

// //   async deleteMotion(id) {
// //     const { error } = await supabase.from('motions').delete().eq('id', id)
// //     if (error) throw error
// //   },

// //   async getFullResults(meetingId) {
// //     const [attendance, peopleVotes, motionVotes] = await Promise.all([
// //       supabase.from('attendance').select('*, users(full_name), sections(title)').eq('meeting_id', meetingId),
// //       supabase.from('votes_people').select('*, candidates(name, category_id, categories(title)), sections(title)').eq('meeting_id', meetingId),
// //       supabase.from('votes_motions').select('*, motions(title), sections(title)').eq('meeting_id', meetingId),
// //     ])
// //     if (attendance.error) throw attendance.error
// //     if (peopleVotes.error) throw peopleVotes.error
// //     if (motionVotes.error) throw motionVotes.error
// //     return { attendance: attendance.data, peopleVotes: peopleVotes.data, motionVotes: motionVotes.data }
// //   },
// // }


// import { supabase } from './supabaseClient'

// export const adminService = {
//   // ── Users ────────────────────────────────────────────────────
//   async getAllUsers() {
//     const { data, error } = await supabase
//       .from('users')
//       .select('*')
//       .order('created_at', { ascending: false })
//     if (error) throw error
//     return data
//   },

//   async updateUserRole(userId, role) {
//     const { data, error } = await supabase
//       .from('users')
//       .update({ role, updated_at: new Date().toISOString() })
//       .eq('id', userId)
//       .select()
//       .single()
//     if (error) throw error
//     return data
//   },

//   // ── Sections ─────────────────────────────────────────────────
//   async createSection(section) {
//     const { data, error } = await supabase.from('sections').insert(section).select().single()
//     if (error) throw error
//     return data
//   },

//   async updateSection(id, updates) {
//     const { data, error } = await supabase.from('sections').update(updates).eq('id', id).select().single()
//     if (error) throw error
//     return data
//   },

//   async deleteSection(id) {
//     const { error } = await supabase.from('sections').delete().eq('id', id)
//     if (error) throw error
//   },

//   // ── Categories ───────────────────────────────────────────────
//   async getCategories(sectionId) {
//     const { data, error } = await supabase
//       .from('categories')
//       .select('*, candidates(*)')
//       .eq('section_id', sectionId)
//       .order('order_index')
//     if (error) throw error
//     return data
//   },

//   async createCategory(category) {
//     const { data, error } = await supabase.from('categories').insert(category).select().single()
//     if (error) throw error
//     return data
//   },

//   async updateCategory(id, updates) {
//     const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single()
//     if (error) throw error
//     return data
//   },

//   async deleteCategory(id) {
//     const { error } = await supabase.from('categories').delete().eq('id', id)
//     if (error) throw error
//   },

//   // ── Candidates ───────────────────────────────────────────────
//   async createCandidate(candidate) {
//     const { data, error } = await supabase.from('candidates').insert(candidate).select().single()
//     if (error) throw error
//     return data
//   },

//   async deleteCandidate(id) {
//     const { error } = await supabase.from('candidates').delete().eq('id', id)
//     if (error) throw error
//   },

//   // ── Motions ──────────────────────────────────────────────────
//   async createMotion(motion) {
//     const { data, error } = await supabase.from('motions').insert(motion).select().single()
//     if (error) throw error
//     return data
//   },

//   async updateMotion(id, updates) {
//     const { data, error } = await supabase.from('motions').update(updates).eq('id', id).select().single()
//     if (error) throw error
//     return data
//   },

//   async deleteMotion(id) {
//     const { error } = await supabase.from('motions').delete().eq('id', id)
//     if (error) throw error
//   },

//   // ── Results ──────────────────────────────────────────────────
//   async getFullResults(meetingId) {
//     const [attendance, peopleVotes, motionVotes] = await Promise.all([
//       supabase
//         .from('attendance')
//         .select('*, users(id, full_name, email), sections(title)')
//         .eq('meeting_id', meetingId),
//       supabase
//         .from('votes_people')
//         .select('*, candidates(id, name, category_id), categories(id, title), sections(title), voters:voter_id(full_name)')
//         .eq('meeting_id', meetingId),
//       supabase
//         .from('votes_motions')
//         .select('*, motions(id, title), sections(id, title), voters:voter_id(full_name)')
//         .eq('meeting_id', meetingId),
//     ])
//     if (attendance.error) throw attendance.error
//     if (peopleVotes.error) throw peopleVotes.error
//     if (motionVotes.error) throw motionVotes.error
//     return {
//       attendance: attendance.data,
//       peopleVotes: peopleVotes.data,
//       motionVotes: motionVotes.data,
//     }
//   },

//   // ── Reports ──────────────────────────────────────────────────
//   async getReportData() {
//     const [meetings, users, attendance, peopleVotes, motionVotes] = await Promise.all([
//       supabase.from('meetings').select('*').order('scheduled_at', { ascending: false }),
//       supabase.from('users').select('id, role, created_at'),
//       supabase.from('attendance').select('id, meeting_id, checked_in, created_at'),
//       supabase.from('votes_people').select('id, meeting_id, created_at'),
//       supabase.from('votes_motions').select('id, meeting_id, vote, created_at'),
//     ])
//     return {
//       meetings: meetings.data || [],
//       users: users.data || [],
//       attendance: attendance.data || [],
//       peopleVotes: peopleVotes.data || [],
//       motionVotes: motionVotes.data || [],
//     }
//   },
// }



import { supabase } from './supabaseClient'

export const adminService = {
  // ── Users ────────────────────────────────────────────────────
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async updateUserRole(userId, role) {
    const { data, error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // ── Categories ───────────────────────────────────────────────
  async getCategoriesBySession(sessionId) {
    const { data, error } = await supabase
      .from('categories')
      .select('*, candidates(*)')
      .eq('session_id', sessionId)
      .order('order_index')
    if (error) throw error
    return data
  },

  async createCategory(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateCategory(id, updates) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteCategory(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
  },

  // ── Candidates ───────────────────────────────────────────────
  async createCandidate(candidate) {
    const { data, error } = await supabase
      .from('candidates')
      .insert(candidate)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteCandidate(id) {
    const { error } = await supabase.from('candidates').delete().eq('id', id)
    if (error) throw error
  },

  // ── Motions ──────────────────────────────────────────────────
  async getMotionsBySession(sessionId) {
    const { data, error } = await supabase
      .from('motions')
      .select('*')
      .eq('session_id', sessionId)
    if (error) throw error
    return data
  },

  async createMotion(motion) {
    const { data, error } = await supabase
      .from('motions')
      .insert(motion)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateMotion(id, updates) {
    const { data, error } = await supabase
      .from('motions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteMotion(id) {
    const { error } = await supabase.from('motions').delete().eq('id', id)
    if (error) throw error
  },

  // ── Results ──────────────────────────────────────────────────
 async getFullResults(meetingId) {
  const [sessions, attendance, peopleVotes, motionVotes] = await Promise.all([
    // ↓ Added election_closed_at and motions_closed_at
    supabase
      .from('sessions')
      .select('id, title, order_index, election_closed_at, motions_closed_at')
      .eq('meeting_id', meetingId)
      .order('order_index'),

    supabase
      .from('attendance')
      .select('*, users(id, full_name, email)')
      .eq('meeting_id', meetingId),

    supabase
      .from('votes_people')
      .select('*, candidates(name, category_id), categories(id, title), voters:voter_id(full_name)')
      .eq('meeting_id', meetingId),

    supabase
      .from('votes_motions')
      .select('*, motions(id, title), voters:voter_id(full_name)')
      .eq('meeting_id', meetingId),
  ])

  if (sessions.error) throw sessions.error
  if (attendance.error) throw attendance.error
  if (peopleVotes.error) throw peopleVotes.error
  if (motionVotes.error) throw motionVotes.error

  // Build session map keyed by ID
  const sessionsByIdMap = {}
  sessions.data?.forEach(s => { sessionsByIdMap[s.id] = s })

  // Manually stamp session_id onto each record for reliable title resolution
  const attendanceWithSession = (attendance.data || []).map(a => ({
    ...a,
    session_id: a.session_id || a.section_id,
  }))

  const peopleVotesWithSession = (peopleVotes.data || []).map(v => ({
    ...v,
    session_id: v.session_id || v.section_id,
  }))

  const motionVotesWithSession = (motionVotes.data || []).map(v => ({
    ...v,
    session_id: v.session_id || v.section_id,
  }))

  return {
    sessions: sessions.data,
    attendance: attendanceWithSession,
    peopleVotes: peopleVotesWithSession,
    motionVotes: motionVotesWithSession,
  }
},

  // ── Reports ──────────────────────────────────────────────────
  async getReportData() {
    const [meetings, users, attendance, peopleVotes, motionVotes] = await Promise.all([
      supabase.from('meetings').select('*').order('scheduled_at', { ascending: false }),
      supabase.from('users').select('id, role, created_at'),
      supabase.from('attendance').select('id, meeting_id, checked_in, created_at'),
      supabase.from('votes_people').select('id, meeting_id, created_at'),
      supabase.from('votes_motions').select('id, meeting_id, vote, created_at'),
    ])
    return {
      meetings: meetings.data || [],
      users: users.data || [],
      attendance: attendance.data || [],
      peopleVotes: peopleVotes.data || [],
      motionVotes: motionVotes.data || [],
    }
  },
}
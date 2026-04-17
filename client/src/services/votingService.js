// import { supabase } from './supabaseClient'

// export const votingService = {
//   // People votes
//   async getCandidates(sectionId) {
//     const { data, error } = await supabase
//       .from('candidates')
//       .select('*')
//       .eq('section_id', sectionId)
//     if (error) throw error
//     return data
//   },

//   async submitPeopleVote({ sectionId, meetingId, userId, candidateId, manualName }) {
//     const { data, error } = await supabase
//       .from('votes_people')
//       .upsert({
//         section_id: sectionId,
//         meeting_id: meetingId,
//         voter_id: userId,
//         candidate_id: candidateId || null,
//         manual_name: manualName || null,
//       })
//       .select()
//       .single()
//     if (error) throw error
//     return data
//   },

//   async getPeopleVoteResults(sectionId) {
//     const { data, error } = await supabase
//       .from('votes_people')
//       .select('*, candidates(name)')
//       .eq('section_id', sectionId)
//     if (error) throw error
//     return data
//   },

//   // Motion votes
//   async getMotions(sectionId) {
//     const { data, error } = await supabase
//       .from('motions')
//       .select('*')
//       .eq('section_id', sectionId)
//     if (error) throw error
//     return data
//   },

//   async submitMotionVote({ motionId, sectionId, meetingId, userId, vote, comment }) {
//     const { data, error } = await supabase
//       .from('votes_motions')
//       .upsert({
//         motion_id: motionId,
//         section_id: sectionId,
//         meeting_id: meetingId,
//         voter_id: userId,
//         vote,
//         comment: comment || null,
//       })
//       .select()
//       .single()
//     if (error) throw error
//     return data
//   },

//   async getMotionVoteResults(motionId) {
//     const { data, error } = await supabase
//       .from('votes_motions')
//       .select('*')
//       .eq('motion_id', motionId)
//     if (error) throw error
//     return data
//   },
// }




import { supabase } from './supabaseClient'

export const votingService = {
  // ── Categories + Candidates ──────────────────────────────────
  async getCategoriesWithCandidates(sectionId) {
    const { data, error } = await supabase
      .from('categories')
      .select('*, candidates(*)')
      .eq('section_id', sectionId)
      .order('order_index')
    if (error) throw error
    return data
  },

  // Legacy: kept for any direct section-level candidate lookup
  async getCandidates(sectionId) {
    const { data, error } = await supabase
      .from('candidates')
      .select('*, categories(title, section_id)')
      .eq('categories.section_id', sectionId)
    if (error) throw error
    return data
  },

  async submitPeopleVote({ sectionId, meetingId, userId, categoryId, candidateId, manualName }) {
    const { data, error } = await supabase
      .from('votes_people')
      .upsert({
        section_id: sectionId,
        meeting_id: meetingId,
        voter_id: userId,
        category_id: categoryId,
        candidate_id: candidateId || null,
        manual_name: manualName || null,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getPeopleVoteResults(sectionId) {
    const { data, error } = await supabase
      .from('votes_people')
      .select('*, candidates(name), categories(title)')
      .eq('section_id', sectionId)
    if (error) throw error
    return data
  },

  // ── Motions ──────────────────────────────────────────────────
  async getMotions(sectionId) {
    const { data, error } = await supabase
      .from('motions')
      .select('*')
      .eq('section_id', sectionId)
    if (error) throw error
    return data
  },

  async submitMotionVote({ motionId, sectionId, meetingId, userId, vote, comment }) {
    const { data, error } = await supabase
      .from('votes_motions')
      .upsert({
        motion_id: motionId,
        section_id: sectionId,
        meeting_id: meetingId,
        voter_id: userId,
        vote,
        comment: comment || null,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getMotionVoteResults(motionId) {
    const { data, error } = await supabase
      .from('votes_motions')
      .select('*')
      .eq('motion_id', motionId)
    if (error) throw error
    return data
  },
}
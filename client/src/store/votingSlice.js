import { createSlice } from '@reduxjs/toolkit'

const votingSlice = createSlice({
  name: 'voting',
  initialState: {
    candidates: [],
    motions: [],
    userVotes: {},
    results: null,
    loading: false,
  },
  reducers: {
    setCandidates(state, action) { state.candidates = action.payload },
    setMotions(state, action) { state.motions = action.payload },
    recordVote(state, action) {
      const { key, value } = action.payload
      state.userVotes[key] = value
    },
    setResults(state, action) { state.results = action.payload },
    setLoading(state, action) { state.loading = action.payload },
    clearVoting(state) {
      state.candidates = []
      state.motions = []
      state.userVotes = {}
      state.results = null
    },
  },
})

export const { setCandidates, setMotions, recordVote, setResults, setLoading, clearVoting } = votingSlice.actions
export default votingSlice.reducer
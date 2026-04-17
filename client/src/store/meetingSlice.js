import { createSlice } from '@reduxjs/toolkit'

const meetingSlice = createSlice({
  name: 'meeting',
  initialState: {
    meetings: [],
    currentMeeting: null,
    sections: [],
    loading: false,
    error: null,
  },
  reducers: {
    setMeetings(state, action) { state.meetings = action.payload },
    setCurrentMeeting(state, action) {
      state.currentMeeting = action.payload
      state.sections = action.payload?.sections || []
    },
    setSections(state, action) { state.sections = action.payload },
    addMeeting(state, action) { state.meetings.unshift(action.payload) },
    updateMeeting(state, action) {
      const idx = state.meetings.findIndex(m => m.id === action.payload.id)
      if (idx !== -1) state.meetings[idx] = action.payload
    },
    removeMeeting(state, action) {
      state.meetings = state.meetings.filter(m => m.id !== action.payload)
    },
    setLoading(state, action) { state.loading = action.payload },
    setError(state, action) { state.error = action.payload },
  },
})

export const { setMeetings, setCurrentMeeting, setSections, addMeeting, updateMeeting, removeMeeting, setLoading, setError } = meetingSlice.actions
export default meetingSlice.reducer
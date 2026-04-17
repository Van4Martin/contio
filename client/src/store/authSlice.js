import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    profile: null,
    loading: true,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload
      state.loading = false
    },
    setProfile(state, action) {
      state.profile = action.payload
    },
    clearUser(state) {
      state.user = null
      state.profile = null
      state.loading = false
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
  },
})

export const { setUser, setProfile, clearUser, setLoading } = authSlice.actions
export default authSlice.reducer
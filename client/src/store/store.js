import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import meetingReducer from './meetingSlice'
import votingReducer from './votingSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meeting: meetingReducer,
    voting: votingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})
// import { useState, useCallback } from 'react'
// import { attendanceService } from '../services/attendanceService'
// import { useAuth } from './useAuth'
// import toast from 'react-hot-toast'

// export function useAttendance() {
//   const { user } = useAuth()
//   const [attendance, setAttendance] = useState([])
//   const [loading, setLoading] = useState(false)

//   const checkIn = useCallback(async (meetingId, sectionId) => {
//     if (!user?.id) return
//     setLoading(true)
//     try {
//       const record = await attendanceService.checkIn(meetingId, sectionId, user.id)
//       toast.success('Checked in successfully!')
//       return record
//     } catch (err) {
//       toast.error(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }, [user?.id])

//   const loadAttendance = useCallback(async (meetingId, sectionId) => {
//     setLoading(true)
//     try {
//       const data = await attendanceService.getAttendance(meetingId, sectionId)
//       setAttendance(data)
//       return data
//     } catch (err) {
//       toast.error(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   const getUserAttendance = useCallback(async (meetingId) => {
//     if (!user?.id) return []
//     try {
//       return await attendanceService.getUserAttendance(user.id, meetingId)
//     } catch (err) {
//       console.error(err)
//       return []
//     }
//   }, [user?.id])

//   return { attendance, loading, checkIn, loadAttendance, getUserAttendance }
// }



import { useState, useCallback } from 'react'
import { attendanceService } from '../services/attendanceService'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export function useAttendance() {
  const { user } = useAuth()
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)

  const checkIn = useCallback(async (meetingId, sessionId) => {
    if (!user?.id) return
    setLoading(true)
    try {
      const record = await attendanceService.checkIn(meetingId, sessionId, user.id)
      toast.success('Checked in successfully!')
      return record
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const loadAttendance = useCallback(async (meetingId, sessionId) => {
    setLoading(true)
    try {
      const data = await attendanceService.getAttendance(meetingId, sessionId)
      setAttendance(data)
      return data
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const getUserAttendanceForMeeting = useCallback(async (meetingId) => {
    if (!user?.id) return []
    try {
      return await attendanceService.getUserAttendanceForMeeting(user.id, meetingId)
    } catch (err) {
      console.error(err)
      return []
    }
  }, [user?.id])

  return { attendance, loading, checkIn, loadAttendance, getUserAttendanceForMeeting }
}
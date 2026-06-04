// import { useEffect } from 'react'
// import { useDispatch } from 'react-redux'
// import { Toaster } from 'react-hot-toast'
// import AppRouter from './navigation/AppRouter'
// import { supabase } from './services/supabaseClient'
// import { setUser, clearUser } from './store/authSlice'

// export default function App() {
//   const dispatch = useDispatch()

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session?.user) dispatch(setUser(session.user))
//     })

//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (session?.user) dispatch(setUser(session.user))
//       else dispatch(clearUser())
//     })

//     return () => subscription.unsubscribe()
//   }, [dispatch])

//   return (
//     <>
//       <AppRouter />
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             background: '#0f1923',
//             color: '#e8e3d9',
//             border: '1px solid #2a3a4a',
//             fontFamily: 'DM Sans, sans-serif',
//             fontSize: '14px',
//           },
//           success: { iconTheme: { primary: '#4ade80', secondary: '#0f1923' } },
//           error: { iconTheme: { primary: '#f87171', secondary: '#0f1923' } },
//         }}
//       />
//     </>
//   )
// }


// import { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Toaster } from 'react-hot-toast'
// import AppRouter from './navigation/AppRouter'
// import { supabase } from './services/supabaseClient'
// import { setUser, clearUser } from './store/authSlice'
// import { meetingService } from './services/meetingService'

// export default function App() {
//   const dispatch = useDispatch()
//   const { user } = useSelector(state => state.auth)

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session?.user) dispatch(setUser(session.user))
//     })
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (session?.user) dispatch(setUser(session.user))
//       else dispatch(clearUser())
//     })
//     return () => subscription.unsubscribe()
//   }, [dispatch])

//   // Auto-activate scheduled meetings when time is due
//   useEffect(() => {
//     const isAdmin = user?.user_metadata?.role === 'admin'
//     if (!isAdmin) return

//     const autoActivate = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('meetings')
//           .select('id, scheduled_at, status')
//           .eq('status', 'scheduled')
//           .lte('scheduled_at', new Date().toISOString())
//         if (error || !data?.length) return
//         for (const meeting of data) {
//           await meetingService.activateMeeting(meeting.id)
//         }
//         if (data.length > 0) {
//           console.log(`Auto-activated ${data.length} meeting(s)`)
//         }
//       } catch (err) {
//         console.error('Auto-activate error:', err)
//       }
//     }

//     autoActivate() // run immediately on mount
//     const interval = setInterval(autoActivate, 60_000) // then every 60s
//     return () => clearInterval(interval)
//   }, [user])

//   return (
//     <>
//       <AppRouter />
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             background: '#0f1923', color: '#e8e3d9',
//             border: '1px solid #2a3a4a', fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
//           },
//           success: { iconTheme: { primary: '#4ade80', secondary: '#0f1923' } },
//           error: { iconTheme: { primary: '#f87171', secondary: '#0f1923' } },
//         }}
//       />
//     </>
//   )
// }



import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import AppRouter from './navigation/AppRouter'
import { supabase } from './services/supabaseClient'
import { setUser, clearUser } from './store/authSlice'
import { meetingService } from './services/meetingService'
import { sessionGuardService } from './services/sessionGuardService'

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

export default function App() {
  const dispatch  = useDispatch()
  const { user }  = useSelector(state => state.auth)
  const validationInterval = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) dispatch(setUser(session.user))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) dispatch(setUser(session.user))
      else dispatch(clearUser())
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  // Register session + start validation loop on login
  useEffect(() => {
    if (!user?.id) {
      if (validationInterval.current) clearInterval(validationInterval.current)
      return
    }

    const init = async () => {
      await sessionGuardService.registerSession(user.id)

      // Validate every 30 seconds — if another device logged in, sign this one out
      validationInterval.current = setInterval(async () => {
        const valid = await sessionGuardService.validateSession(user.id)
        if (!valid) {
          clearInterval(validationInterval.current)
          await supabase.auth.signOut()
          dispatch(clearUser())
          toast.error('You have been signed out because your account was logged in on another device.', { duration: 8000 })
        } else {
          sessionGuardService.refreshSession(user.id)
        }
      }, 30_000)
    }

    init()
    return () => { if (validationInterval.current) clearInterval(validationInterval.current) }
  }, [user?.id, dispatch])

  // Session expiry after 24 hours
  useEffect(() => {
    if (!user) return
    const loginTime = user.last_sign_in_at
    if (!loginTime) return

    const elapsed   = Date.now() - new Date(loginTime).getTime()
    const remaining = SESSION_DURATION_MS - elapsed

    if (remaining <= 0) {
      supabase.auth.signOut()
      dispatch(clearUser())
      return
    }

    const timer = setTimeout(async () => {
      await supabase.auth.signOut()
      dispatch(clearUser())
      toast('Your session has expired. Please log in again.', { icon: '⏰', duration: 6000 })
    }, remaining)

    return () => clearTimeout(timer)
  }, [user, dispatch])

  // Auto-activate scheduled meetings (admin only)
  useEffect(() => {
    const isAdmin = user?.user_metadata?.role === 'admin'
    if (!isAdmin) return
    const autoActivate = async () => {
      try {
        const { data } = await supabase
          .from('meetings')
          .select('id')
          .eq('status', 'scheduled')
          .lte('scheduled_at', new Date().toISOString())
        if (!data?.length) return
        for (const meeting of data) await meetingService.activateMeeting(meeting.id)
      } catch (err) { console.error('Auto-activate error:', err) }
    }
    autoActivate()
    const interval = setInterval(autoActivate, 60_000)
    return () => clearInterval(interval)
  }, [user])

  // Sign out on logout (clear active session)
  useEffect(() => {
    if (!user) {
      sessionGuardService.clearSession(null)
    }
  }, [user])

  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a18', color: '#f0ede8',
            border: '1px solid #2e2e2a',
            fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
          },
          success: { iconTheme: { primary: '#6db87a', secondary: '#1a1a18' } },
          error:   { iconTheme: { primary: '#c96a6a', secondary: '#1a1a18' } },
        }}
      />
    </>
  )
}
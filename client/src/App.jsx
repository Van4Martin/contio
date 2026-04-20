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


import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import AppRouter from './navigation/AppRouter'
import { supabase } from './services/supabaseClient'
import { setUser, clearUser } from './store/authSlice'
import { meetingService } from './services/meetingService'

export default function App() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

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

  // Auto-activate scheduled meetings when time is due
  useEffect(() => {
    const isAdmin = user?.user_metadata?.role === 'admin'
    if (!isAdmin) return

    const autoActivate = async () => {
      try {
        const { data, error } = await supabase
          .from('meetings')
          .select('id, scheduled_at, status')
          .eq('status', 'scheduled')
          .lte('scheduled_at', new Date().toISOString())
        if (error || !data?.length) return
        for (const meeting of data) {
          await meetingService.activateMeeting(meeting.id)
        }
        if (data.length > 0) {
          console.log(`Auto-activated ${data.length} meeting(s)`)
        }
      } catch (err) {
        console.error('Auto-activate error:', err)
      }
    }

    autoActivate() // run immediately on mount
    const interval = setInterval(autoActivate, 60_000) // then every 60s
    return () => clearInterval(interval)
  }, [user])

  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1923', color: '#e8e3d9',
            border: '1px solid #2a3a4a', fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#0f1923' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#0f1923' } },
        }}
      />
    </>
  )
}
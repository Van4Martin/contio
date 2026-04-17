import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import AppRouter from './navigation/AppRouter'
import { supabase } from './services/supabaseClient'
import { setUser, clearUser } from './store/authSlice'

export default function App() {
  const dispatch = useDispatch()

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

  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1923',
            color: '#e8e3d9',
            border: '1px solid #2a3a4a',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#0f1923' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#0f1923' } },
        }}
      />
    </>
  )
}
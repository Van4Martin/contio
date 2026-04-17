import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { authService } from '../services/authService'
import { setUser, setProfile, clearUser } from '../store/authSlice'
import toast from 'react-hot-toast'

export function useAuth() {
  const dispatch = useDispatch()
  const { user, profile, loading } = useSelector(state => state.auth)

  const isAdmin = user?.user_metadata?.role === 'admin' || profile?.role === 'admin'

  const login = useCallback(async (credentials) => {
    try {
      const data = await authService.login(credentials)
      dispatch(setUser(data.user))
      return data
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }, [dispatch])

  const register = useCallback(async (userData) => {
    try {
      const data = await authService.register(userData)
      return data
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
      dispatch(clearUser())
    } catch (err) {
      toast.error(err.message)
    }
  }, [dispatch])

  const loadProfile = useCallback(async () => {
    if (!user?.id) return
    try {
      const p = await authService.getProfile(user.id)
      dispatch(setProfile(p))
    } catch (err) {
      console.error('Profile load error:', err)
    }
  }, [user?.id, dispatch])

  return { user, profile, loading, isAdmin, login, register, logout, loadProfile }
}
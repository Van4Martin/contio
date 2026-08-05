import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../services/supabaseClient'
import { authService } from '../../services/authService'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import logo from '../../assets/images/logo.jpg'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [loading, setLoading]           = useState(false)
  const [done, setDone]                 = useState(false)
  const [error, setError]               = useState('')
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState(false)

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash
    // onAuthStateChange picks it up automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true)
      }
    })

    // Timeout — if no recovery event fires, the link is invalid or expired
    const timeout = setTimeout(() => {
      setSessionError(true)
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await authService.updatePassword(password)
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div className="fade-in" style={{
        width: '100%', maxWidth: '420px',
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', padding: '40px', boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden' }}>
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px' }}>
            ST ANTHONY OF PADUA CUSTODY
          </span>
        </div>

        {/* ── Success state ── */}
        {done && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--success-dim)', border: '1px solid rgba(34,197,94,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', color: 'var(--success)',
            }}>
              <CheckCircle size={28} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>
              Password updated
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
              Your password has been changed successfully. Redirecting you to sign in...
            </p>
          </div>
        )}

        {/* ── Invalid / expired link ── */}
        {!done && sessionError && !sessionReady && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', color: 'var(--danger)',
            }}>
              <AlertCircle size={28} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>
              Link expired
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              style={{ display: 'inline-block', padding: '10px 20px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
            >
              Request new link
            </Link>
          </div>
        )}

        {/* ── Waiting for Supabase recovery session ── */}
        {!done && !sessionError && !sessionReady && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', padding: '20px 0' }}>
            Verifying reset link...
          </div>
        )}

        {/* ── Reset form ── */}
        {!done && sessionReady && (
          <div className="fade-in">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
              Set new password
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>
              Choose a strong password for your account.
            </p>

            {error && (
              <div style={{
                padding: '12px 14px', background: 'var(--danger-dim)',
                border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)',
                color: 'var(--danger)', fontSize: '14px', marginBottom: '20px',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="New Password" type="password" icon={<Lock size={15} />}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters" required
                hint="At least 8 characters"
              />
              <Input
                label="Confirm New Password" type="password" icon={<Lock size={15} />}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter your password" required
                error={confirm && password !== confirm ? 'Passwords do not match' : ''}
              />
              <Button type="submit" loading={loading} fullWidth size="lg" style={{ marginTop: '4px' }}>
                Update Password
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
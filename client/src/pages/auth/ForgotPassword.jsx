import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { authService } from '../../services/authService'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import logo from '../../assets/images/logo.jpg'

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.sendPasswordReset(email)
      setSent(true)
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

        {sent ? (
          /* ── Success state ── */
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
              Check your email
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
              We sent a password reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
              Click the link in that email to set a new password.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Didn't receive it? Check your spam folder or{' '}
              <button
                onClick={() => setSent(false)}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, padding: 0 }}
              >
                try again
              </button>
              .
            </p>
            <Link
              to="/login"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none' }}
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        ) : (
          /* ── Request form ── */
          <>
            <Link
              to="/login"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '24px' }}
            >
              <ArrowLeft size={13} /> Back to Sign In
            </Link>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
              Forgot password?
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>
              Enter the email address on your account and we'll send you a link to reset your password.
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
                label="Email address" type="email" icon={<Mail size={15} />}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
              />
              <Button type="submit" loading={loading} fullWidth size="lg" style={{ marginTop: '4px' }}>
                Send Reset Link
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
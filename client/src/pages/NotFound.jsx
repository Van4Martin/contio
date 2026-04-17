import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import { Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '24px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '96px', fontWeight: 800, color: 'var(--border-light)', lineHeight: 1 }}>404</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '340px' }}>The page you're looking for doesn't exist or has been moved.</p>
      <Button icon={<Home size={15} />} onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
    </div>
  )
}
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CheckCircle, Home } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/common/Button'

export default function VoteSummary() {
  const { id: meetingId } = useParams()
  const navigate = useNavigate()
  const userVotes = useSelector(state => state.voting.userVotes)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '500px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }} className="fade-in">
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--success-dim)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--success)' }}>
          <CheckCircle size={32} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, marginBottom: '10px' }}>Votes Recorded</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', lineHeight: 1.7 }}>
          Your participation has been securely recorded. Thank you for taking part in this meeting.
        </p>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '28px', textAlign: 'left' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Summary</div>
          {Object.keys(userVotes).length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No votes recorded this session.</p>
          ) : (
            Object.entries(userVotes).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key.replace('_', ' ')}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{String(value)}</span>
              </div>
            ))
          )}
        </div>
        <Button icon={<Home size={15} />} onClick={() => navigate('/dashboard')} fullWidth>Back to Dashboard</Button>
      </main>
    </div>
  )
}
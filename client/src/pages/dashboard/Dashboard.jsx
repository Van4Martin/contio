import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Users, ChevronRight, Clock, CheckCircle, PlayCircle } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Loader from '../../components/common/Loader'
import { meetingService } from '../../services/meetingService'
import { formatDateTime } from '../../utils/formatDate'
import { useAuth } from '../../hooks/useAuth'

const statusConfig = {
  draft: { color: 'var(--text-muted)', bg: 'var(--bg-hover)', icon: <Clock size={12} /> },
  scheduled: { color: 'var(--warning)', bg: 'var(--warning-dim)', icon: <Calendar size={12} /> },
  active: { color: 'var(--success)', bg: 'var(--success-dim)', icon: <PlayCircle size={12} /> },
  completed: { color: 'var(--accent)', bg: 'var(--accent-dim)', icon: <CheckCircle size={12} /> },
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    meetingService.getAllMeetings()
      .then(setMeetings)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <><Navbar /><Loader /></>

  const name = user?.user_metadata?.full_name || 'there'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="fade-in">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, marginBottom: '6px' }}>
            Hello, {name} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
            Here are your upcoming and recent meetings.
          </p>

          {meetings.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 24px',
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
            }}>
              <Calendar size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>No Chapters yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Chapters will appear here once created by an admin.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {meetings.map((meeting, i) => {
                const status = statusConfig[meeting.status] || statusConfig.draft
                return (
                  <div
                    key={meeting.id}
                    onClick={() => navigate(`/meeting/${meeting.id}`)}
                    className="fade-in"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '20px 24px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      animationDelay: `${i * 0.05}s`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'var(--bg-elevated)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '44px', height: '44px',
                        background: 'var(--accent-dim)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent)',
                      }}>
                        <Calendar size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '15px', marginBottom: '4px' }}>
                          {meeting.title}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span>{formatDateTime(meeting.scheduled_at)}</span>
                          {meeting.location && <span>📍 {meeting.location}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '4px 10px',
                        background: status.bg, color: status.color,
                        borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                        textTransform: 'capitalize',
                      }}>
                        {status.icon} {meeting.status}
                      </span>
                      <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
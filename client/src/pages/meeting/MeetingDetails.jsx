import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, List, ChevronRight, ArrowLeft } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { meetingService } from '../../services/meetingService'
import { formatDateTime } from '../../utils/formatDate'

export default function MeetingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    meetingService.getMeetingById(id)
      .then(setMeeting)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <><Navbar /><Loader /></>
  if (!meeting) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>Meeting not found.</div></>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back
        </button>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>{meeting.title}</h1>
          {meeting.description && <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.7 }}>{meeting.description}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <InfoChip icon={<Calendar size={14} />} label={formatDateTime(meeting.scheduled_at)} />
            {meeting.location && <InfoChip icon={<MapPin size={14} />} label={meeting.location} />}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <ActionCard
            icon={<Users size={22} />}
            title="Attendance"
            desc="Check in for meeting sections"
            onClick={() => navigate(`/meeting/${id}/attendance`)}
            color="var(--accent)"
          />
          <ActionCard
            icon={<List size={22} />}
            title="Sections & Voting"
            desc="View agenda and cast votes"
            onClick={() => navigate(`/meeting/${id}/sections`)}
            color="var(--success)"
          />
        </div>
      </main>
    </div>
  )
}

function InfoChip({ icon, label }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border)' }}>
      {icon} {label}
    </span>
  )
}

function ActionCard({ icon, title, desc, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '24px',
        textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
        display: 'flex', flexDirection: 'column', gap: '12px',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = 'var(--bg-elevated)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)' }}
    >
      <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{desc}</div>
      </div>
      <ChevronRight size={16} style={{ color: 'var(--text-muted)', alignSelf: 'flex-end' }} />
    </button>
  )
}
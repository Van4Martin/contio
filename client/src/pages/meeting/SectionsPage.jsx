import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Vote, FileText, ChevronRight } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Loader from '../../components/common/Loader'
import { meetingService } from '../../services/meetingService'
import { SECTION_TYPES } from '../../utils/constants'

const typeConfig = {
  election: { label: 'Election', icon: <Vote size={18} />, color: 'var(--warning)', action: 'Vote for Candidates' },
  motion: { label: 'Motion', icon: <FileText size={18} />, color: 'var(--accent)', action: 'Vote on Motions' },
  attendance: { label: 'Attendance', icon: <Vote size={18} />, color: 'var(--success)', action: 'Check In' },
  general: { label: 'General', icon: <FileText size={18} />, color: 'var(--text-secondary)', action: 'View' },
}

export default function SectionsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    meetingService.getMeetingSections(id)
      .then(setSections)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Meeting Sections</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Select a section to participate.</p>

        {sections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>
            No sections have been added to this meeting yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sections.map((section, i) => {
              const cfg = typeConfig[section.type] || typeConfig.general
              return (
                <div
                  key={section.id}
                  className="fade-in"
                  style={{ animationDelay: `${i * 0.06}s`, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => {
                    if (section.type === SECTION_TYPES.ELECTION) navigate(`/meeting/${id}/vote/people/${section.id}`)
                    else if (section.type === SECTION_TYPES.MOTION) navigate(`/meeting/${id}/vote/motions/${section.id}`)
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.color; e.currentTarget.style.background = 'var(--bg-elevated)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: `${cfg.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.color }}>
                      {cfg.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>{section.title}</div>
                      <div style={{ fontSize: '12px', color: cfg.color, marginTop: '2px' }}>{cfg.label}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {cfg.action} <ChevronRight size={15} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
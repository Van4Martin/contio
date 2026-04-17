import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Vote, FileText } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Loader from '../../components/common/Loader'
import { adminService } from '../../services/adminService'

export default function Results() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('attendance')

  useEffect(() => {
    adminService.getFullResults(meetingId).then(setResults).finally(() => setLoading(false))
  }, [meetingId])

  if (loading) return <><Navbar /><Loader /></>

  const tabs = [
    { id: 'attendance', label: 'Attendance', icon: <Users size={15} /> },
    { id: 'people', label: 'Elections', icon: <Vote size={15} /> },
    { id: 'motions', label: 'Motions', icon: <FileText size={15} /> },
  ]

  const motionTally = {}
  results?.motionVotes?.forEach(v => {
    const title = v.motions?.title || v.motion_id
    if (!motionTally[title]) motionTally[title] = { yes: 0, no: 0, abstain: 0 }
    motionTally[title][v.vote] = (motionTally[title][v.vote] || 0) + 1
  })

  const peopleTally = {}
  results?.peopleVotes?.forEach(v => {
    const name = v.candidates?.name || v.manual_name || 'Unknown'
    peopleTally[name] = (peopleTally[name] || 0) + 1
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '28px' }}>Meeting Results</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '4px', marginBottom: '28px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '9px', borderRadius: 'var(--radius-md)', border: 'none',
              background: tab === t.id ? 'var(--bg-elevated)' : 'transparent',
              color: tab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer', fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-body)',
              transition: 'all 0.2s',
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'attendance' && (
          <ResultTable rows={results?.attendance?.map(a => ({ label: a.users?.full_name, value: a.checked_in ? '✓ Present' : '✗ Absent', color: a.checked_in ? 'var(--success)' : 'var(--danger)' }))} emptyMsg="No attendance data." />
        )}

        {tab === 'people' && (
          <ResultTable rows={Object.entries(peopleTally).sort((a,b) => b[1]-a[1]).map(([name, count]) => ({ label: name, value: `${count} vote${count !== 1 ? 's' : ''}`, color: 'var(--accent)' }))} emptyMsg="No election votes recorded." />
        )}

        {tab === 'motions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.keys(motionTally).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>No motion votes recorded.</div>
            ) : Object.entries(motionTally).map(([title, counts]) => {
              const total = counts.yes + counts.no + counts.abstain
              return (
                <div key={title} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                  <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: '14px' }}>{title}</div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[['Yes', counts.yes, 'var(--success)'], ['No', counts.no, 'var(--danger)'], ['Abstain', counts.abstain, 'var(--text-muted)']].map(([l, v, c]) => (
                      <div key={l} style={{ flex: 1, background: `${c}14`, border: `1px solid ${c}30`, borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)', color: c }}>{v}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{l} ({total > 0 ? Math.round(v/total*100) : 0}%)</div>
                      </div>
                    ))}
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

function ResultTable({ rows = [], emptyMsg }) {
  if (!rows.length) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>{emptyMsg}</div>
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
          <span style={{ fontSize: '14px' }}>{row.label}</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: row.color }}>{row.value}</span>
        </div>
      ))}
    </div>
  )
}
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar, Users, CheckSquare, Vote, TrendingUp,
  ArrowLeft, BarChart2, Activity, Percent
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Loader from '../../components/common/Loader'
import { adminService } from '../../services/adminService'
import { formatDate } from '../../utils/formatDate'

export default function Reports() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getReportData()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <><Navbar /><Loader /></>

  const { meetings, users, attendance, peopleVotes, motionVotes } = data

  // ── Derived stats ────────────────────────────────────────────
  const totalMeetings = meetings.length
  const completedMeetings = meetings.filter(m => m.status === 'completed').length
  const activeMeetings = meetings.filter(m => m.status === 'active').length
  const totalUsers = users.length
  const adminCount = users.filter(u => u.role === 'admin').length
  const memberCount = users.filter(u => u.role === 'member').length
  const totalCheckIns = attendance.filter(a => a.checked_in).length
  const totalVotesCast = peopleVotes.length + motionVotes.length

  const motionYes = motionVotes.filter(v => v.vote === 'yes').length
  const motionNo = motionVotes.filter(v => v.vote === 'no').length
  const motionAbstain = motionVotes.filter(v => v.vote === 'abstain').length
  const motionTotal = motionVotes.length

  // Participation per meeting
  const meetingStats = meetings.map(m => {
    const checkins = attendance.filter(a => a.meeting_id === m.id && a.checked_in).length
    const pvotes = peopleVotes.filter(v => v.meeting_id === m.id).length
    const mvotes = motionVotes.filter(v => v.meeting_id === m.id).length
    return { ...m, checkins, votes: pvotes + mvotes }
  })

  // New users per month (last 6 months)
  const now = new Date()
  const monthLabels = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return { label: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear(), month: d.getMonth() }
  })
  const usersByMonth = monthLabels.map(({ label, year, month }) => ({
    label,
    count: users.filter(u => {
      const d = new Date(u.created_at)
      return d.getFullYear() === year && d.getMonth() === month
    }).length,
  }))
  const maxMonthCount = Math.max(...usersByMonth.map(m => m.count), 1)

  // Meeting status distribution
  const statusCounts = ['draft', 'scheduled', 'active', 'completed', 'cancelled'].map(s => ({
    label: s, count: meetings.filter(m => m.status === s).length,
  }))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <BarChart2 size={22} style={{ color: 'var(--accent)' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800 }}>Reports</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '36px', fontSize: '14px' }}>
          Aggregate analytics across all Chapters and Users.
        </p>

        {/* ── Top KPI Cards ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {[
            { icon: <Calendar size={18} />, label: 'Total Chapters', value: totalMeetings, color: 'var(--accent)', sub: `${completedMeetings} completed` },
            { icon: <Users size={18} />, label: 'Registered Users', value: totalUsers, color: 'var(--success)', sub: `${adminCount} admin · ${memberCount} member` },
            { icon: <CheckSquare size={18} />, label: 'Total Check-ins', value: totalCheckIns, color: 'var(--warning)', sub: `across all chapters` },
            { icon: <Vote size={18} />, label: 'Total Votes Cast', value: totalVotesCast, color: '#a78bfa', sub: `${peopleVotes.length} election · ${motionVotes.length} motion` },
          ].map(card => (
            <div key={card.label} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: card.color }}>
                {card.icon}
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{card.label}</span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-display)', color: card.color, marginBottom: '4px' }}>
                {card.value}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Row 2: Motion breakdown + User growth ─────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>

          {/* Motion vote breakdown */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Activity size={16} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>Motion Vote Breakdown</h3>
            </div>
            {motionTotal === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No motion votes yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Yes', count: motionYes, color: 'var(--success)', bg: 'var(--success-dim)' },
                  { label: 'No', count: motionNo, color: 'var(--danger)', bg: 'var(--danger-dim)' },
                  { label: 'Abstain', count: motionAbstain, color: 'var(--text-muted)', bg: 'var(--bg-hover)' },
                ].map(row => {
                  const pct = motionTotal > 0 ? Math.round(row.count / motionTotal * 100) : 0
                  return (
                    <div key={row.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                        <span style={{ color: row.color, fontWeight: 600 }}>{row.label}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{row.count} ({pct}%)</span>
                      </div>
                      <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: row.color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* User registrations per month */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>New Capitulars (Last 6 Months)</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px' }}>
              {usersByMonth.map(({ label, count }) => {
                const height = maxMonthCount > 0 ? Math.max((count / maxMonthCount) * 80, count > 0 ? 8 : 0) : 0
                return (
                  <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{count > 0 ? count : ''}</span>
                    <div style={{
                      width: '100%', height: `${height}px`,
                      background: 'var(--accent)', borderRadius: '4px 4px 0 0',
                      opacity: count === 0 ? 0.2 : 1,
                      minHeight: '4px',
                      transition: 'height 0.6s ease',
                    }} />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Meeting status distribution ────────────────────────── */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Percent size={16} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>Meeting Status Distribution</h3>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {statusCounts.map(({ label, count }) => {
              const colors = {
                draft: 'var(--text-muted)', scheduled: 'var(--warning)',
                active: 'var(--success)', completed: 'var(--accent)', cancelled: 'var(--danger)',
              }
              const color = colors[label]
              return (
                <div key={label} style={{
                  flex: '1', minWidth: '100px', textAlign: 'center',
                  padding: '16px 12px',
                  background: `${color}10`,
                  border: `1px solid ${color}30`,
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color }}>{count}</div>
                  <div style={{ fontSize: '12px', color, marginTop: '4px', textTransform: 'capitalize', fontWeight: 500 }}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Per-meeting participation table ───────────────────── */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={16} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>Participation by Meeting</h3>
          </div>

          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '10px 24px', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>Meeting</span>
            <span>Date</span>
            <span>Status</span>
            <span style={{ textAlign: 'center' }}>Check-ins</span>
            <span style={{ textAlign: 'center' }}>Votes Cast</span>
          </div>

          {meetingStats.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>No Chapters found.</div>
          ) : meetingStats.map((m, i) => {
            const statusColor = { draft: 'var(--text-muted)', scheduled: 'var(--warning)', active: 'var(--success)', completed: 'var(--accent)', cancelled: 'var(--danger)' }[m.status]
            return (
              <div
                key={m.id}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  padding: '14px 24px',
                  borderBottom: i < meetingStats.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'center', transition: 'background 0.15s', cursor: 'pointer',
                }}
                onClick={() => navigate(`/admin/results/${m.id}`)}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{m.title}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{formatDate(m.scheduled_at)}</span>
                <span style={{ fontSize: '12px', color: statusColor, fontWeight: 600, textTransform: 'capitalize' }}>{m.status}</span>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--warning)' }}>{m.checkins}</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{m.votes}</span>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
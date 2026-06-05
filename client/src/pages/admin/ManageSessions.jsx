import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Plus, Trash2, ArrowLeft, Vote, FileText,
  UserCheck, ListChecks, Lock, ChevronDown, ChevronUp,
  Settings
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import { meetingService } from '../../services/meetingService'
import { adminService } from '../../services/adminService'
import { useAuth } from '../../hooks/useAuth'
import { formatDateTime } from '../../utils/formatDate'
import toast from 'react-hot-toast'

export default function ManageSessions() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [meeting, setMeeting] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})

  // Session modal
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [sessionForm, setSessionForm] = useState({ title: '', description: '', has_election: false, agenda: '' })
  const [savingSession, setSavingSession] = useState(false)

  // Agenda modal
  const [agendaModal, setAgendaModal] = useState(null) // sessionId
  const [agendaItems, setAgendaItems] = useState([])
  const [agendaForm, setAgendaForm] = useState({ title: '', description: '' })
  const [savingAgenda, setSavingAgenda] = useState(false)

  // Election close
  const [closingElectionId, setClosingElectionId] = useState(null)

  useEffect(() => {
    const load = async () => {
      const [m, s] = await Promise.all([
        meetingService.getMeetingById(meetingId),
        meetingService.getSessionsByMeeting(meetingId),
      ])
      setMeeting(m)
      setSessions(s)
      const exp = {}
      s.forEach(sess => { exp[sess.id] = true })
      setExpanded(exp)
    }
    load().finally(() => setLoading(false))
  }, [meetingId])

  // ── Session CRUD ─────────────────────────────────────────────
  const handleCreateSession = async () => {
    if (!sessionForm.title.trim()) { toast.error('Session title is required'); return }
    setSavingSession(true)
    try {
      const s = await meetingService.createSession({
        ...sessionForm,
        meeting_id: meetingId,
        order_index: sessions.length,
        attendance_open: true,
        election_open: false,
        motions_open: true,
      })
      setSessions(prev => [...prev, s])
      setExpanded(prev => ({ ...prev, [s.id]: true }))
      setShowSessionModal(false)
      setSessionForm({ title: '', description: '', has_election: false, agenda: '' })
      toast.success('Session created!')
    } catch (err) { toast.error(err.message) }
    finally { setSavingSession(false) }
  }

  const handleDeleteSession = async (id) => {
    if (!confirm('Delete this session and all its data?')) return
    try {
      await meetingService.deleteSession(id)
      setSessions(prev => prev.filter(s => s.id !== id))
      toast.success('Session deleted.')
    } catch (err) { toast.error(err.message) }
  }

  // ── Toggle controls ──────────────────────────────────────────
  const toggleControl = async (sessionId, field, currentVal) => {
    try {
      const updated = await meetingService.updateSession(sessionId, { [field]: !currentVal })
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ...updated } : s))
    } catch (err) { toast.error(err.message) }
  }

  const handleOpenElection = async (sessionId) => {
    try {
      const updated = await meetingService.openElection(sessionId)
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ...updated } : s))
      toast.success('Election opened.')
    } catch (err) { toast.error(err.message) }
  }

  const handleCloseElection = async (sessionId) => {
    setClosingElectionId(sessionId)
    try {
      const updated = await meetingService.closeElection(sessionId, user.id)
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ...updated } : s))
      toast.success('Election closed.')
    } catch (err) { toast.error(err.message) }
    finally { setClosingElectionId(null) }
  }

  // ── Agenda ───────────────────────────────────────────────────
  const openAgendaModal = async (sessionId) => {
    const items = await meetingService.getAgendaItems(sessionId)
    setAgendaItems(items)
    setAgendaModal(sessionId)
    setAgendaForm({ title: '', description: '' })
  }

  const handleAddAgendaItem = async () => {
    if (!agendaForm.title.trim()) { toast.error('Agenda item title required'); return }
    setSavingAgenda(true)
    try {
      const item = await meetingService.createAgendaItem({
        ...agendaForm,
        session_id: agendaModal,
        order_index: agendaItems.length,
      })
      setAgendaItems(prev => [...prev, item])
      setAgendaForm({ title: '', description: '' })
      toast.success('Agenda item added!')
    } catch (err) { toast.error(err.message) }
    finally { setSavingAgenda(false) }
  }

  const handleDeleteAgendaItem = async (id) => {
    try {
      await meetingService.deleteAgendaItem(id)
      setAgendaItems(prev => prev.filter(i => i.id !== id))
    } catch (err) { toast.error(err.message) }
  }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">

        {/* Header */}
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back to Meetings
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '4px' }}>
              {meeting?.title}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Manage sessions — each session has attendance, optional motions & election.
            </p>
          </div>
          <Button icon={<Plus size={15} />} onClick={() => setShowSessionModal(true)}>New Session</Button>
        </div>

        <div style={{ marginBottom: '28px' }} />

        {/* Sessions */}
        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
            <p>No sessions yet. Add the first session to structure this meeting.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sessions.map((session, idx) => {
              const isExpanded = expanded[session.id]
              const electionClosed = !!session.election_closed_at

              return (
                <div key={session.id} className="fade-in" style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                  animationDelay: `${idx * 0.05}s`,
                }}>

                  {/* Session header row */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', background: 'var(--bg-elevated)',
                    borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }}
                      onClick={() => setExpanded(prev => ({ ...prev, [session.id]: !isExpanded }))}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: 'var(--radius-sm)',
                        background: 'var(--accent-dim)', border: '1px solid rgba(59,130,246,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent)', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '14px',
                      }}>
                        {idx + 1}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{session.title}</div>
                        {session.description && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{session.description}</div>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Button size="sm" variant="ghost" icon={<ListChecks size={13} />} onClick={() => openAgendaModal(session.id)}>Agenda</Button>
                      {session.has_election && (
                        <Button size="sm" variant="ghost" icon={<Vote size={13} />}
                          onClick={() => navigate(`/admin/election/${session.id}`)}>
                          Election Categories
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" icon={<FileText size={13} />}
                        onClick={() => navigate(`/admin/motions-session/${session.id}`)}>
                        Motions
                      </Button>
                      <Button size="sm" variant="danger" icon={<Trash2 size={13} />}
                        onClick={() => handleDeleteSession(session.id)} />
                      <button
                        onClick={() => setExpanded(prev => ({ ...prev, [session.id]: !isExpanded }))}
                        style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded controls */}
                  {isExpanded && (
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                        Session Controls
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>

                        {/* Attendance toggle */}
                        <ControlCard
                          icon={<UserCheck size={16} />}
                          title="Attendance"
                          desc={session.attendance_open ? 'Members can check in' : 'Check-in is closed'}
                          active={session.attendance_open}
                          onToggle={() => toggleControl(session.id, 'attendance_open', session.attendance_open)}
                          activeColor="var(--success)"
                        />

                        {/* Motions toggle */}
                        <ControlCard
                          icon={<FileText size={16} />}
                          title="Motions"
                          desc={session.motions_open ? 'Members can vote on motions' : 'Motion voting closed'}
                          active={session.motions_open}
                          onToggle={() => toggleControl(session.id, 'motions_open', session.motions_open)}
                          activeColor="var(--accent)"
                        />

                        {/* Election */}
                        <div style={{
                          padding: '14px 16px',
                          background: session.has_election ? 'rgba(245,158,11,0.06)' : 'var(--bg-elevated)',
                          border: `1px solid ${session.has_election ? 'rgba(245,158,11,0.25)' : 'var(--border)'}`,
                          borderRadius: 'var(--radius-md)',
                          display: 'flex', flexDirection: 'column', gap: '10px',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Vote size={16} style={{ color: session.has_election ? 'var(--warning)' : 'var(--text-muted)' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: '13px' }}>Election</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>
                                {electionClosed ? `Closed ${formatDateTime(session.election_closed_at)}`
                                  : session.election_open ? 'Voting is open'
                                  : session.has_election ? 'Election configured, not yet open'
                                  : 'No election in this session'}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {!session.has_election && (
                              <Button size="sm" variant="secondary"
                                onClick={() => toggleControl(session.id, 'has_election', false)}>
                                Enable Election
                              </Button>
                            )}
                            {session.has_election && !session.election_open && !electionClosed && (
                              <Button size="sm" variant="secondary"
                                onClick={() => handleOpenElection(session.id)}>
                                Open Voting
                              </Button>
                            )}
                            {session.election_open && !electionClosed && (
                              <Button size="sm" icon={<Lock size={12} />}
                                loading={closingElectionId === session.id}
                                style={{ background: 'var(--warning)', color: '#000', border: 'none' }}
                                onClick={() => handleCloseElection(session.id)}>
                                Close Election
                              </Button>
                            )}
                            {electionClosed && (
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Lock size={12} /> Election closed
                              </span>
                            )}
                            {session.motions_open && !session.motions_closed_at && (
  <Button
    size="sm"
    onClick={async () => {
      const updated = await meetingService.updateSession(session.id, {
        motions_open: false,
        motions_closed_at: new Date().toISOString(),
      })
      setSessions(prev => prev.map(s => s.id === session.id ? { ...s, ...updated } : s))
      toast.success('Motions closed.')
    }}
  >
    Close Motions
  </Button>
)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Create session modal */}
      <Modal isOpen={showSessionModal} onClose={() => setShowSessionModal(false)} title="New Session">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Session Title" value={sessionForm.title} onChange={e => setSessionForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Opening, Business, Elections" />
          <Input label="Description (optional)" value={sessionForm.description} onChange={e => setSessionForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" />
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <input
              type="checkbox"
              checked={sessionForm.has_election}
              onChange={e => setSessionForm(f => ({ ...f, has_election: e.target.checked }))}
              style={{ width: '16px', height: '16px', accentColor: 'var(--warning)', cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Include Election</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Enable voting categories and candidates in this session</div>
            </div>
          </label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setShowSessionModal(false)} fullWidth>Cancel</Button>
            <Button onClick={handleCreateSession} loading={savingSession} fullWidth>Create Session</Button>
          </div>
        </div>
      </Modal>

      {/* Agenda modal */}
      <Modal isOpen={!!agendaModal} onClose={() => setAgendaModal(null)} title="Session Agenda" width="520px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {agendaItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              No agenda items yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {agendaItems.map((item, i) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', minWidth: '20px', fontWeight: 700 }}>{i + 1}.</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.title}</div>
                      {item.description && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.description}</div>}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteAgendaItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7, flexShrink: 0 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Input label="Item Title" value={agendaForm.title} onChange={e => setAgendaForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Review previous minutes" />
            <Input label="Notes (optional)" value={agendaForm.description} onChange={e => setAgendaForm(f => ({ ...f, description: e.target.value }))} placeholder="Additional context" />
            <Button onClick={handleAddAgendaItem} loading={savingAgenda} icon={<Plus size={14} />}>Add Item</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function ControlCard({ icon, title, desc, active, onToggle, activeColor }) {
  return (
    <div style={{
      padding: '14px 16px',
      background: active ? `${activeColor}08` : 'var(--bg-elevated)',
      border: `1px solid ${active ? `${activeColor}30` : 'var(--border)'}`,
      borderRadius: 'var(--radius-md)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{ color: active ? activeColor : 'var(--text-muted)', marginTop: '1px' }}>{icon}</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '13px', color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{title}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</div>
        </div>
      </div>
      <button
        onClick={onToggle}
        style={{
          width: '38px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer',
          background: active ? activeColor : 'var(--border)',
          position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: '3px',
          left: active ? '19px' : '3px',
          width: '16px', height: '16px', borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
        }} />
      </button>
    </div>
  )
}
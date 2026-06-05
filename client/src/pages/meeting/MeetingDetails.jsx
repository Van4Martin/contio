// // import { useEffect, useState } from 'react'
// // import { useParams, useNavigate } from 'react-router-dom'
// // import { Calendar, MapPin, Users, List, ChevronRight, ArrowLeft } from 'lucide-react'
// // import Navbar from '../../components/layout/Navbar'
// // import Button from '../../components/common/Button'
// // import Loader from '../../components/common/Loader'
// // import { meetingService } from '../../services/meetingService'
// // import { formatDateTime } from '../../utils/formatDate'

// // export default function MeetingDetails() {
// //   const { id } = useParams()
// //   const navigate = useNavigate()
// //   const [meeting, setMeeting] = useState(null)
// //   const [loading, setLoading] = useState(true)

// //   useEffect(() => {
// //     meetingService.getMeetingById(id)
// //       .then(setMeeting)
// //       .catch(console.error)
// //       .finally(() => setLoading(false))
// //   }, [id])

// //   if (loading) return <><Navbar /><Loader /></>
// //   if (!meeting) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>Meeting not found.</div></>

// //   return (
// //     <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
// //       <Navbar />
// //       <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
// //         <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
// //           <ArrowLeft size={15} /> Back
// //         </button>

// //         <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', marginBottom: '24px' }}>
// //           <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>{meeting.title}</h1>
// //           {meeting.description && <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.7 }}>{meeting.description}</p>}
// //           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
// //             <InfoChip icon={<Calendar size={14} />} label={formatDateTime(meeting.scheduled_at)} />
// //             {meeting.location && <InfoChip icon={<MapPin size={14} />} label={meeting.location} />}
// //           </div>
// //         </div>

// //         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
// //           <ActionCard
// //             icon={<Users size={22} />}
// //             title="Attendance"
// //             desc="Check in for meeting sections"
// //             onClick={() => navigate(`/meeting/${id}/attendance`)}
// //             color="var(--accent)"
// //           />
// //           <ActionCard
// //             icon={<List size={22} />}
// //             title="Sections & Voting"
// //             desc="View agenda and cast votes"
// //             onClick={() => navigate(`/meeting/${id}/sections`)}
// //             color="var(--success)"
// //           />
// //         </div>
// //       </main>
// //     </div>
// //   )
// // }

// // function InfoChip({ icon, label }) {
// //   return (
// //     <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border)' }}>
// //       {icon} {label}
// //     </span>
// //   )
// // }

// // function ActionCard({ icon, title, desc, onClick, color }) {
// //   return (
// //     <button
// //       onClick={onClick}
// //       style={{
// //         background: 'var(--bg-surface)', border: '1px solid var(--border)',
// //         borderRadius: 'var(--radius-lg)', padding: '24px',
// //         textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
// //         display: 'flex', flexDirection: 'column', gap: '12px',
// //       }}
// //       onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = 'var(--bg-elevated)' }}
// //       onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)' }}
// //     >
// //       <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
// //         {icon}
// //       </div>
// //       <div>
// //         <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '4px' }}>{title}</div>
// //         <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{desc}</div>
// //       </div>
// //       <ChevronRight size={16} style={{ color: 'var(--text-muted)', alignSelf: 'flex-end' }} />
// //     </button>
// //   )
// // }




// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import {
//   Calendar, MapPin, ArrowLeft, ChevronDown, ChevronUp,
//   CheckCircle, Clock, Vote, FileText, ListChecks,
//   UserCheck
// } from 'lucide-react'
// import Navbar from '../../components/layout/Navbar'
// import Button from '../../components/common/Button'
// import Loader from '../../components/common/Loader'
// import { meetingService } from '../../services/meetingService'
// import { useAttendance } from '../../hooks/useAttendance'
// import { formatDateTime } from '../../utils/formatDate'

// const STATUS_CONFIG = {
//   draft:     { color: 'var(--text-muted)',  label: 'Draft' },
//   scheduled: { color: 'var(--warning)',      label: 'Scheduled' },
//   active:    { color: 'var(--success)',      label: 'Active' },
//   completed: { color: 'var(--accent)',       label: 'Completed' },
//   cancelled: { color: 'var(--danger)',       label: 'Cancelled' },
// }

// export default function MeetingDetails() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { checkIn, getUserAttendanceForMeeting, loading: attendanceLoading } = useAttendance()

//   const [meeting, setMeeting] = useState(null)
//   const [sessions, setSessions] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [expandedSessions, setExpandedSessions] = useState({})
//   const [checkedInSessions, setCheckedInSessions] = useState(new Set())

//   useEffect(() => {
//     const load = async () => {
//       const [m, attended] = await Promise.all([
//         meetingService.getMeetingById(id),
//         getUserAttendanceForMeeting(id),
//       ])
//       setMeeting(m)
//       // Load sessions separately for ordering
//       const s = await meetingService.getSessionsByMeeting(id)
//       setSessions(s)
//       // Pre-expand all sessions
//       const exp = {}
//       s.forEach(sess => { exp[sess.id] = true })
//       setExpandedSessions(exp)
//       // Mark attended sessions
//       const attendedSet = new Set(attended.filter(a => a.checked_in).map(a => a.session_id))
//       setCheckedInSessions(attendedSet)
//     }
//     load().finally(() => setLoading(false))
//   }, [id])

//   const handleCheckIn = async (sessionId) => {
//     await checkIn(id, sessionId)
//     setCheckedInSessions(prev => new Set([...prev, sessionId]))
//   }

//   const toggleSession = (sessionId) => {
//     setExpandedSessions(prev => ({ ...prev, [sessionId]: !prev[sessionId] }))
//   }

//   if (loading) return <><Navbar /><Loader /></>
//   if (!meeting) return (
//     <><Navbar />
//       <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>Meeting not found.</div>
//     </>
//   )

//   const statusCfg = STATUS_CONFIG[meeting.status] || STATUS_CONFIG.draft
//   const isActive = meeting.status === 'active'

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
//       <Navbar />
//       <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">

//         {/* Back */}
//         <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
//           <ArrowLeft size={15} /> Back
//         </button>

//         {/* Meeting header card */}
//         <div style={{
//           background: 'var(--bg-surface)', border: '1px solid var(--border)',
//           borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: '28px',
//         }}>
//           <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
//             <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, margin: 0 }}>
//               {meeting.title}
//             </h1>
//             <span style={{
//               padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
//               background: `${statusCfg.color}18`, color: statusCfg.color,
//               border: `1px solid ${statusCfg.color}30`, whiteSpace: 'nowrap', flexShrink: 0,
//             }}>
//               {statusCfg.label}
//             </span>
//           </div>

//           {meeting.description && (
//             <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.7, fontSize: '14px' }}>
//               {meeting.description}
//             </p>
//           )}

//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
//             <InfoChip icon={<Calendar size={13} />} label={formatDateTime(meeting.scheduled_at)} />
//             {meeting.location && <InfoChip icon={<MapPin size={13} />} label={meeting.location} />}
//           </div>

//           {!isActive && meeting.status !== 'completed' && (
//             <div style={{ marginTop: '16px', padding: '12px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-muted)' }}>
//               {meeting.status === 'scheduled'
//                 ? '⏳ This meeting will become active at the scheduled time.'
//                 : meeting.status === 'cancelled'
//                 ? '❌ This meeting has been cancelled.'
//                 : '📝 This meeting is in draft and not yet scheduled.'}
//             </div>
//           )}
//         </div>

//         {/* Sessions */}
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
//           <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, margin: 0 }}>
//             Sessions ({sessions.length})
//           </h2>
//         </div>

//         {sessions.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>
//             No sessions have been added to this meeting yet.
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
//             {sessions.map((session, idx) => {
//               const isExpanded = expandedSessions[session.id]
//               const checkedIn = checkedInSessions.has(session.id)

//               return (
//                 <div key={session.id} className="fade-in" style={{
//                   background: 'var(--bg-surface)', border: '1px solid var(--border)',
//                   borderRadius: 'var(--radius-lg)', overflow: 'hidden',
//                   animationDelay: `${idx * 0.06}s`,
//                 }}>
//                   {/* Session header */}
//                   <div
//                     onClick={() => toggleSession(session.id)}
//                     style={{
//                       display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                       padding: '16px 20px', background: 'var(--bg-elevated)',
//                       cursor: 'pointer', userSelect: 'none',
//                       borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
//                     }}
//                   >
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                       <div style={{
//                         width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
//                         background: 'var(--accent-dim)', border: '1px solid rgba(59,130,246,0.2)',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
//                       }}>
//                         {idx + 1}
//                       </div>
//                       <div>
//                         <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>
//                           {session.title}
//                         </div>
//                         <div style={{ display: 'flex', gap: '10px', marginTop: '3px' }}>
//                           <SessionBadge active={session.attendance_open} icon={<UserCheck size={11} />} label="Attendance" />
//                           {session.has_election && <SessionBadge active={session.election_open} icon={<Vote size={11} />} label="Election" />}
//                           {session.motions_open !== false && <SessionBadge active icon={<FileText size={11} />} label="Motions" />}
//                         </div>
//                       </div>
//                     </div>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                       {checkedIn && (
//                         <span style={{ fontSize: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
//                           <CheckCircle size={13} /> Present
//                         </span>
//                       )}
//                       {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
//                     </div>
//                   </div>

//                   {/* Session body */}
//                   {isExpanded && (
//                     <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

//                       {session.description && (
//                         <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
//                           {session.description}
//                         </p>
//                       )}

//                       {/* Agenda */}
//                       {session.agenda_items?.length > 0 && (
//                         <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
//                           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
//                             <ListChecks size={13} /> Agenda
//                           </div>
//                           <ol style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
//                             {session.agenda_items.map(item => (
//                               <li key={item.id} style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
//                                 <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.title}</span>
//                                 {item.description && <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>— {item.description}</span>}
//                               </li>
//                             ))}
//                           </ol>
//                         </div>
//                       )}

//                       {/* Action tiles */}
//                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>

//                         {/* Attendance */}
//                         {session.attendance_open && isActive && (
//                           <ActionTile
//                             icon={<UserCheck size={20} />}
//                             title={checkedIn ? 'Checked In' : 'Check In'}
//                             desc={checkedIn ? 'Attendance recorded' : 'Mark your attendance'}
//                             color="var(--success)"
//                             done={checkedIn}
//                             onClick={checkedIn ? null : () => handleCheckIn(session.id)}
//                             loading={attendanceLoading}
//                           />
//                         )}

//                         {/* Election */}
//                         {session.has_election && session.election_open && isActive && (
//                           <ActionTile
//                             icon={<Vote size={20} />}
//                             title="Election"
//                             desc="Cast your votes"
//                             color="var(--warning)"
//                             onClick={() => navigate(`/meeting/${id}/session/${session.id}/election`)}
//                           />
//                         )}

//                         {/* Motions */}
//                         {session.motions_open && isActive && (
//                           <ActionTile
//                             icon={<FileText size={20} />}
//                             title="Motions"
//                             desc="Vote on motions"
//                             color="var(--accent)"
//                             onClick={() => navigate(`/meeting/${id}/session/${session.id}/motions`)}
//                           />
//                         )}

//                         {!isActive && (
//                           <div style={{ gridColumn: '1 / -1', padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
//                             {meeting.status === 'completed' ? '✓ Meeting concluded' : '⏳ Participation opens when meeting is active'}
//                           </div>
//                         )}
//                       </div>

//                     </div>
//                   )}
//                 </div>
//               )
//             })}
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }

// function InfoChip({ icon, label }) {
//   return (
//     <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '5px 12px', borderRadius: '20px', border: '1px solid var(--border)' }}>
//       {icon} {label}
//     </span>
//   )
// }

// function SessionBadge({ active, icon, label }) {
//   return (
//     <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: active ? 'var(--success)' : 'var(--text-muted)', background: active ? 'var(--success-dim)' : 'var(--bg-hover)', padding: '2px 7px', borderRadius: '8px' }}>
//       {icon} {label}
//     </span>
//   )
// }

// function ActionTile({ icon, title, desc, color, onClick, done = false, loading = false }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={done || loading || !onClick}
//       style={{
//         display: 'flex', flexDirection: 'column', gap: '10px',
//         padding: '16px', textAlign: 'left',
//         background: done ? `${color}0a` : 'var(--bg-elevated)',
//         border: `1px solid ${done ? `${color}30` : 'var(--border)'}`,
//         borderRadius: 'var(--radius-md)',
//         cursor: done || !onClick ? 'default' : 'pointer',
//         transition: 'all 0.2s', fontFamily: 'var(--font-body)',
//         opacity: loading ? 0.7 : 1,
//       }}
//       onMouseEnter={e => { if (!done && onClick) e.currentTarget.style.borderColor = color }}
//       onMouseLeave={e => { if (!done && onClick) e.currentTarget.style.borderColor = 'var(--border)' }}
//     >
//       <div style={{ color: done ? color : 'var(--text-secondary)' }}>{icon}</div>
//       <div>
//         <div style={{ fontWeight: 600, fontSize: '13px', color: done ? color : 'var(--text-primary)', marginBottom: '2px' }}>{title}</div>
//         <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</div>
//       </div>
//     </button>
//   )
// }



import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Calendar, MapPin, ArrowLeft, ChevronDown, ChevronUp,
  CheckCircle, Vote, FileText, ListChecks, UserCheck, Lock
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Loader from '../../components/common/Loader'
import { meetingService } from '../../services/meetingService'
import { votingService } from '../../services/votingService'
import { useAttendance } from '../../hooks/useAttendance'
import { useAuth } from '../../hooks/useAuth'
import { formatDateTime } from '../../utils/formatDate'

const STATUS_CONFIG = {
  draft:     { color: 'var(--text-muted)',  label: 'Draft' },
  scheduled: { color: 'var(--warning)',      label: 'Scheduled' },
  active:    { color: 'var(--success)',      label: 'Active' },
  completed: { color: 'var(--accent)',       label: 'Completed' },
  cancelled: { color: 'var(--danger)',       label: 'Cancelled' },
}

export default function MeetingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { checkIn, getUserAttendanceForMeeting, loading: attendanceLoading } = useAttendance()

  const [meeting, setMeeting] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedSessions, setExpandedSessions] = useState({})
  const [checkedInSessions, setCheckedInSessions] = useState(new Set())

  // Track voted state: { [sessionId]: { election: Set<categoryId>, motions: Set<motionId> } }
  const [votedElections, setVotedElections] = useState({}) // sessionId -> Set of categoryIds voted
  const [votedMotions, setVotedMotions]     = useState({}) // sessionId -> Set of motionIds voted

  useEffect(() => {
    const load = async () => {
      const [m, s, attended] = await Promise.all([
        meetingService.getMeetingById(id),
        meetingService.getSessionsByMeeting(id),
        getUserAttendanceForMeeting(id),
      ])
      setMeeting(m)
      setSessions(s)

      // Expand all sessions by default
      const exp = {}
      s.forEach(sess => { exp[sess.id] = true })
      setExpandedSessions(exp)

      // Mark attended sessions
      const attendedSet = new Set(
        attended.filter(a => a.checked_in).map(a => a.session_id)
      )
      setCheckedInSessions(attendedSet)

      // Load existing votes for each session
      if (user?.id) {
        const electionMap = {}
        const motionMap   = {}

        await Promise.all(s.map(async (sess) => {
          // Election votes
          if (sess.has_election) {
            const peopleVotes = await votingService.getUserPeopleVotes(user.id, sess.id)
            electionMap[sess.id] = new Set(peopleVotes.map(v => v.category_id))
          }
          // Motion votes
          if (sess.motions_open !== false) {
            const motionVotes = await votingService.getUserMotionVotes(user.id, sess.id)
            motionMap[sess.id] = new Set(motionVotes.map(v => v.motion_id))
          }
        }))

        setVotedElections(electionMap)
        setVotedMotions(motionMap)
      }
    }
    load().finally(() => setLoading(false))
  }, [id, user?.id])

  const handleCheckIn = async (sessionId) => {
  const record = await checkIn(id, sessionId, meeting)
  // Only mark as checked in if the server confirmed it
  if (record) {
    setCheckedInSessions(prev => new Set([...prev, sessionId]))
  }
}

  const toggleSession = (sessionId) => {
    setExpandedSessions(prev => ({ ...prev, [sessionId]: !prev[sessionId] }))
  }

  // After returning from election page, mark all categories as voted
  const markElectionVoted = (sessionId) => {
    // We'll rely on re-fetching on return; navigate handles this naturally
  }

  if (loading) return <><Navbar /><Loader /></>
  if (!meeting) return (
    <><Navbar />
      <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>Meeting not found.</div>
    </>
  )

  const statusCfg = STATUS_CONFIG[meeting.status] || STATUS_CONFIG.draft
  const isActive  = meeting.status === 'active'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back
        </button>

        {/* Meeting header */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, margin: 0 }}>
              {meeting.title}
            </h1>
            <span style={{
              padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
              background: `${statusCfg.color}18`, color: statusCfg.color,
              border: `1px solid ${statusCfg.color}30`, whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {statusCfg.label}
            </span>
          </div>

          {meeting.description && (
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.7, fontSize: '14px' }}>
              {meeting.description}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <InfoChip icon={<Calendar size={13} />} label={formatDateTime(meeting.scheduled_at)} />
            {meeting.location && <InfoChip icon={<MapPin size={13} />} label={meeting.location} />}
          </div>

          {!isActive && meeting.status !== 'completed' && (
            <div style={{ marginTop: '16px', padding: '12px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-muted)' }}>
              {meeting.status === 'scheduled' ? '⏳ This meeting will become active at the scheduled time.'
                : meeting.status === 'cancelled' ? '❌ This meeting has been cancelled.'
                : '📝 This meeting is in draft and not yet scheduled.'}
            </div>
          )}
        </div>

        {/* Sessions */}
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, margin: 0 }}>
            Sessions ({sessions.length})
          </h2>
        </div>

        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>
            No sessions have been added yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sessions.map((session, idx) => {
              const isExpanded  = expandedSessions[session.id]
              const checkedIn   = checkedInSessions.has(session.id)

              // Election: has the user voted in ALL categories?
              const electionVotedCategories = votedElections[session.id] // Set or undefined
              const electionFullyVoted = session.has_election &&
                electionVotedCategories && electionVotedCategories.size > 0

              // Motions: has the user voted on at least one motion?
              const motionVotedSet   = votedMotions[session.id] // Set or undefined
              const motionsVoted     = motionVotedSet && motionVotedSet.size > 0

              return (
                <div key={session.id} className="fade-in" style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                  animationDelay: `${idx * 0.06}s`,
                }}>
                  {/* Session header */}
                  <div
                    onClick={() => toggleSession(session.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 20px', background: 'var(--bg-elevated)',
                      cursor: 'pointer', userSelect: 'none',
                      borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
                        background: 'var(--accent-dim)', border: '1px solid rgba(59,130,246,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
                      }}>
                        {idx + 1}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>
                          {session.title}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                          <SessionBadge active={session.attendance_open} icon={<UserCheck size={11} />} label="Attendance" />
                          {session.has_election && <SessionBadge active={session.election_open} icon={<Vote size={11} />} label="Election" />}
                          <SessionBadge active={session.motions_open} icon={<FileText size={11} />} label="Motions" />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {checkedIn && (
                        <span style={{ fontSize: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={13} /> Present
                        </span>
                      )}
                      {isExpanded
                        ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} />
                        : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                      }
                    </div>
                  </div>

                  {/* Session body */}
                  {isExpanded && (
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                      {session.description && (
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {session.description}
                        </p>
                      )}

                      {/* ── Agenda ──────────────────────────────── */}
                      {session.agenda_items?.length > 0 && (
                        <div style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px 16px',
                        }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            marginBottom: '12px',
                            fontSize: '11px', color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600,
                          }}>
                            <ListChecks size={13} /> Agenda
                          </div>
                          <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {session.agenda_items
                              .sort((a, b) => a.order_index - b.order_index)
                              .map((item, i) => (
                              <li key={item.id} style={{ fontSize: '14px', color: 'var(--text-secondary)', paddingLeft: '4px' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.title}</span>
                                {item.description && (
                                  <span style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'block', marginTop: '2px' }}>
                                    {item.description}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* ── Action tiles ─────────────────────────── */}
                      {isActive ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>

                          {/* Attendance */}
                          {session.attendance_open && (
                            <ActionTile
                              icon={<UserCheck size={20} />}
                              title={checkedIn ? 'Checked In' : 'Check In'}
                              desc={checkedIn ? 'Attendance recorded' : meeting?.geofence_enabled ? '📍 Location required' : 'Mark your attendance'}
                              color="var(--success)"
                              done={checkedIn}
                              doneLabel="Already checked in"
                              onClick={checkedIn ? null : () => handleCheckIn(session.id)}
                              loading={attendanceLoading}
                            />
                          )}

                          {/* Election */}
                          {session.has_election && session.election_open && (
                            <ActionTile
                              icon={<Vote size={20} />}
                              title={electionFullyVoted ? 'Vote Submitted' : 'Election'}
                              desc={electionFullyVoted ? 'Your ballot is recorded' : 'Cast your votes'}
                              color="var(--warning)"
                              done={electionFullyVoted}
                              doneLabel="Ballot already submitted"
                              onClick={electionFullyVoted ? null : () => navigate(`/meeting/${id}/session/${session.id}/election`)}
                            />
                          )}

                          {session.has_election && !session.election_open && (
                            <ActionTile
                              icon={<Lock size={20} />}
                              title="Election Closed"
                              desc={session.election_closed_at ? 'Voting has ended' : 'Not yet open'}
                              color="var(--text-muted)"
                              done
                              doneLabel={session.election_closed_at ? 'Election closed' : 'Not open yet'}
                            />
                          )}

                          {/* Motions */}
                          {session.motions_open && (
                            <ActionTile
                              icon={<FileText size={20} />}
                              title={motionsVoted ? 'Votes Recorded' : 'Motions'}
                              desc={motionsVoted ? 'Your votes are recorded' : 'Vote on motions'}
                              color="var(--accent)"
                              done={motionsVoted}
                              doneLabel="Already voted on motions"
                              onClick={motionsVoted ? null : () => navigate(`/meeting/${id}/session/${session.id}/motions`)}
                            />
                          )}

                        </div>
                      ) : (
                        <div style={{
                          padding: '14px 16px',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center',
                        }}>
                          {meeting.status === 'completed'
                            ? '✓ Meeting concluded'
                            : '⏳ Participation opens when the meeting is active'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

function InfoChip({ icon, label }) {
  return (
    <span style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      fontSize: '13px', color: 'var(--text-secondary)',
      background: 'var(--bg-elevated)', padding: '5px 12px',
      borderRadius: '20px', border: '1px solid var(--border)',
    }}>
      {icon} {label}
    </span>
  )
}

function SessionBadge({ active, icon, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      fontSize: '11px',
      color: active ? 'var(--success)' : 'var(--text-muted)',
      background: active ? 'var(--success-dim)' : 'var(--bg-hover)',
      padding: '2px 7px', borderRadius: '8px',
    }}>
      {icon} {label}
    </span>
  )
}

function ActionTile({ icon, title, desc, color, onClick, done = false, doneLabel = '', loading = false }) {
  return (
    <button
      onClick={onClick}
      disabled={done || loading || !onClick}
      title={done ? doneLabel : undefined}
      style={{
        display: 'flex', flexDirection: 'column', gap: '10px',
        padding: '16px', textAlign: 'left',
        background: done ? `${color}0d` : 'var(--bg-elevated)',
        border: `1px solid ${done ? `${color}35` : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        cursor: done || !onClick ? 'default' : 'pointer',
        transition: 'all 0.2s', fontFamily: 'var(--font-body)',
        opacity: loading ? 0.7 : 1,
        position: 'relative',
      }}
      onMouseEnter={e => { if (!done && onClick && !loading) e.currentTarget.style.borderColor = color }}
      onMouseLeave={e => { if (!done && onClick) e.currentTarget.style.borderColor = done ? `${color}35` : 'var(--border)' }}
    >
      {/* Done overlay checkmark */}
      {done && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          color: color, opacity: 0.8,
        }}>
          <CheckCircle size={14} />
        </div>
      )}
      <div style={{ color: done ? color : 'var(--text-secondary)' }}>{icon}</div>
      <div>
        <div style={{
          fontWeight: 600, fontSize: '13px',
          color: done ? color : 'var(--text-primary)',
          marginBottom: '2px',
        }}>
          {title}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</div>
      </div>
    </button>
  )
}
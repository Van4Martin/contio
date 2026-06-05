// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { ArrowLeft } from 'lucide-react'
// import Navbar from '../../components/layout/Navbar'
// import MotionVoteCard from '../../components/voting/MotionVoteCard'
// import CommentBox from '../../components/voting/CommentBox'
// import Button from '../../components/common/Button'
// import Loader from '../../components/common/Loader'
// import { useVoting } from '../../hooks/useVoting'

// export default function SessionMotions() {
//   const { meetingId, sessionId } = useParams()
//   const navigate = useNavigate()
//   const { motions, userVotes, loading, loadMotions, voteMotion } = useVoting()
//   const [votes, setVotes] = useState({})
//   const [comments, setComments] = useState({})
//   const [submitting, setSubmitting] = useState(false)

//   useEffect(() => { loadMotions(sessionId) }, [sessionId])

//   const handleSubmit = async () => {
//     setSubmitting(true)
//     for (const motion of motions) {
//       if (votes[motion.id]) {
//         await voteMotion({ motionId: motion.id, sessionId, meetingId, vote: votes[motion.id], comment: comments[motion.id] || '' })
//       }
//     }
//     setSubmitting(false)
//     navigate(`/meeting/${meetingId}`)
//   }

//   const allVoted = motions.length > 0 && motions.every(m => votes[m.id])

//   if (loading) return <><Navbar /><Loader /></>

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
//       <Navbar />
//       <main style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
//         <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
//           <ArrowLeft size={15} /> Back
//         </button>
//         <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Motions</h1>
//         <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>Vote on each motion and optionally add a comment.</p>

//         {motions.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>No motions have been added to this session.</div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//             {motions.map(motion => (
//               <div key={motion.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                 <MotionVoteCard
//                   motion={motion}
//                   selectedVote={votes[motion.id]}
//                   onVote={v => setVotes(prev => ({ ...prev, [motion.id]: v }))}
//                 />
//                 <CommentBox
//                   value={comments[motion.id] || ''}
//                   onChange={v => setComments(prev => ({ ...prev, [motion.id]: v }))}
//                 />
//               </div>
//             ))}
//             <Button fullWidth size="lg" onClick={handleSubmit} loading={submitting} disabled={!allVoted}>
//               Submit All Votes
//             </Button>
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }




// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { ArrowLeft, CheckCircle, Lock } from 'lucide-react'
// import Navbar from '../../components/layout/Navbar'
// import MotionVoteCard from '../../components/voting/MotionVoteCard'
// import CommentBox from '../../components/voting/CommentBox'
// import Button from '../../components/common/Button'
// import Loader from '../../components/common/Loader'
// import { useVoting } from '../../hooks/useVoting'
// import { votingService } from '../../services/votingService'
// import { useAuth } from '../../hooks/useAuth'
// import toast from 'react-hot-toast'

// const VOTE_LABELS = { yes: '✓ Yes', no: '✗ No', abstain: '— Abstain' }
// const VOTE_COLORS = { yes: 'var(--success)', no: 'var(--danger)', abstain: 'var(--text-muted)' }

// export default function SessionMotions() {
//   const { meetingId, sessionId } = useParams()
//   const navigate   = useNavigate()
//   const { user }   = useAuth()
//   const { motions, loading, loadMotions, voteMotion } = useVoting()

//   const [votes, setVotes]               = useState({})
//   const [comments, setComments]         = useState({})
//   const [existingVotes, setExistingVotes] = useState({}) // motionId -> { vote, comment }
//   const [submitting, setSubmitting]     = useState(false)
//   const [checkingVotes, setCheckingVotes] = useState(true)

//   useEffect(() => {
//     const init = async () => {
//       await loadMotions(sessionId)
//       if (user?.id) {
//         const existing = await votingService.getUserMotionVotes(user.id, sessionId)
//         const map = {}
//         existing.forEach(v => { map[v.motion_id] = { vote: v.vote, comment: v.comment } })
//         setExistingVotes(map)
//       }
//       setCheckingVotes(false)
//     }
//     init()
//   }, [sessionId, user?.id])

//   const pendingMotions = motions.filter(m => !existingVotes[m.id])
//   const allPendingVoted = pendingMotions.length > 0 && pendingMotions.every(m => votes[m.id])

//   const handleSubmit = async () => {
//     setSubmitting(true)
//     try {
//       for (const motion of pendingMotions) {
//         if (votes[motion.id]) {
//           await voteMotion({
//             motionId: motion.id, sessionId, meetingId,
//             vote: votes[motion.id],
//             comment: comments[motion.id] || '',
//           })
//         }
//       }
//       toast.success('Votes recorded!')
//       navigate(`/meeting/${meetingId}`)
//     } catch (err) {
//       toast.error(err.message)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (loading || checkingVotes) return <><Navbar /><Loader /></>

//   // All motions already voted
//   const allVotedAlready = motions.length > 0 && motions.every(m => existingVotes[m.id])

//   if (allVotedAlready) {
//     return (
//       <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
//         <Navbar />
//         <main style={{ maxWidth: '520px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
//           <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--accent)' }}>
//             <CheckCircle size={32} />
//           </div>
//           <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>
//             Votes Already Recorded
//           </h2>
//           <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.7 }}>
//             You have already voted on all motions in this session.
//           </p>

//           {/* Show summary of their votes */}
//           <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '28px', textAlign: 'left' }}>
//             {motions.map(m => {
//               const ev = existingVotes[m.id]
//               return (
//                 <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
//                   <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{m.title}</span>
//                   <span style={{ fontSize: '13px', fontWeight: 700, color: VOTE_COLORS[ev?.vote] || 'var(--text-muted)' }}>
//                     {VOTE_LABELS[ev?.vote] || '—'}
//                   </span>
//                 </div>
//               )
//             })}
//           </div>

//           <Button onClick={() => navigate(`/meeting/${meetingId}`)}>Back to Meeting</Button>
//         </main>
//       </div>
//     )
//   }

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
//       <Navbar />
//       <main style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
//         <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
//           <ArrowLeft size={15} /> Back
//         </button>

//         <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Motions</h1>
//         <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
//           Vote on each motion and optionally add a comment.
//         </p>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

//           {/* Already voted motions — locked display */}
//           {motions.filter(m => existingVotes[m.id]).map(m => {
//             const ev = existingVotes[m.id]
//             return (
//               <div key={m.id} style={{
//                 background: `${VOTE_COLORS[ev.vote]}08`,
//                 border: `1px solid ${VOTE_COLORS[ev.vote]}30`,
//                 borderRadius: 'var(--radius-lg)', padding: '16px 20px',
//               }}>
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: ev.comment ? '10px' : '0' }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                     <Lock size={14} style={{ color: 'var(--text-muted)' }} />
//                     <span style={{ fontWeight: 600, fontSize: '14px' }}>{m.title}</span>
//                   </div>
//                   <span style={{
//                     fontSize: '12px', fontWeight: 700,
//                     color: VOTE_COLORS[ev.vote],
//                     background: `${VOTE_COLORS[ev.vote]}15`,
//                     padding: '3px 10px', borderRadius: '12px',
//                   }}>
//                     {VOTE_LABELS[ev.vote]}
//                   </span>
//                 </div>
//                 {ev.comment && (
//                   <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: '24px' }}>
//                     "{ev.comment}"
//                   </div>
//                 )}
//               </div>
//             )
//           })}

//           {/* Pending motions */}
//           {pendingMotions.map(motion => (
//             <div key={motion.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//               <MotionVoteCard
//                 motion={motion}
//                 selectedVote={votes[motion.id]}
//                 onVote={v => setVotes(prev => ({ ...prev, [motion.id]: v }))}
//               />
//               <CommentBox
//                 value={comments[motion.id] || ''}
//                 onChange={v => setComments(prev => ({ ...prev, [motion.id]: v }))}
//               />
//             </div>
//           ))}

//           {pendingMotions.length > 0 && (
//             <Button fullWidth size="lg" onClick={handleSubmit} loading={submitting} disabled={!allPendingVoted}>
//               Submit Votes
//             </Button>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }



import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Lock } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import MotionVoteCard from '../../components/voting/MotionVoteCard'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { useVoting } from '../../hooks/useVoting'
import { votingService } from '../../services/votingService'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const VOTE_LABELS = {
  yes: '✓ Placet',
  'juxta modum': '~ Placet Juxta Modum',
  no: '✗ Non Placet',
  abstain: '— Abstain',
}
const VOTE_COLORS = {
  yes: 'var(--success)',
  'juxta modum': 'var(--success)',
  no: 'var(--danger)',
  abstain: 'var(--text-muted)',
}

export default function SessionMotions() {
  const { meetingId, sessionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { motions, loading, loadMotions, voteMotion } = useVoting()

  const [votes, setVotes]                 = useState({})
  const [comments, setComments]           = useState({})
  const [existingVotes, setExistingVotes] = useState({})
  const [submitting, setSubmitting]       = useState(false)
  const [checkingVotes, setCheckingVotes] = useState(true)

  useEffect(() => {
    const init = async () => {
      await loadMotions(sessionId)
      if (user?.id) {
        const existing = await votingService.getUserMotionVotes(user.id, sessionId)
        const map = {}
        existing.forEach(v => { map[v.motion_id] = { vote: v.vote, comment: v.comment } })
        setExistingVotes(map)
      }
      setCheckingVotes(false)
    }
    init()
  }, [sessionId, user?.id])

  const pendingMotions = motions.filter(m => !existingVotes[m.id])

  // A motion is fully answered if:
  // - it has a vote selected, AND
  // - if that vote is 'juxta modum', a non-empty comment is provided
  const allPendingVoted = pendingMotions.length > 0 && pendingMotions.every(m => {
    const vote = votes[m.id]
    if (!vote) return false
    if (vote === 'juxta modum' && !comments[m.id]?.trim()) return false
    return true
  })

  const handleVote = (motionId, value) => {
    setVotes(prev => ({ ...prev, [motionId]: value }))
    // Clear comment when switching away from juxta modum
    if (value !== 'juxta modum') {
      setComments(prev => ({ ...prev, [motionId]: '' }))
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      for (const motion of pendingMotions) {
        if (votes[motion.id]) {
          await voteMotion({
            motionId: motion.id,
            sessionId,
            meetingId,
            vote: votes[motion.id],
            comment: comments[motion.id] || '',
          })
        }
      }
      toast.success('Votes recorded!')
      navigate(`/meeting/${meetingId}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || checkingVotes) return <><Navbar /><Loader /></>

  const allVotedAlready = motions.length > 0 && motions.every(m => existingVotes[m.id])

  if (allVotedAlready) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
        <Navbar />
        <main style={{ maxWidth: '520px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'var(--accent-dim)', border: '1px solid rgba(59,130,246,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', color: 'var(--accent)',
          }}>
            <CheckCircle size={32} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>
            Votes Already Recorded
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.7 }}>
            You have already voted on all motions in this session.
          </p>

          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '16px',
            marginBottom: '28px', textAlign: 'left',
          }}>
            {motions.map((m, i) => {
              const ev = existingVotes[m.id]
              return (
                <div key={m.id} style={{
                  padding: '12px 0',
                  borderBottom: i < motions.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', flex: 1 }}>{m.title}</span>
                    <span style={{
                      fontSize: '12px', fontWeight: 700,
                      color: VOTE_COLORS[ev?.vote] || 'var(--text-muted)',
                      background: `${VOTE_COLORS[ev?.vote] || 'var(--text-muted)'}15`,
                      padding: '3px 10px', borderRadius: '12px', whiteSpace: 'nowrap',
                    }}>
                      {VOTE_LABELS[ev?.vote] || '—'}
                    </span>
                  </div>
                  {ev?.comment && (
                    <div style={{
                      fontSize: '13px', color: 'var(--text-muted)',
                      fontStyle: 'italic', marginTop: '6px', paddingLeft: '4px',
                    }}>
                      "{ev.comment}"
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <Button onClick={() => navigate(`/meeting/${meetingId}`)}>Back to Meeting</Button>
        </main>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
          Motions
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
          Vote on each motion. Select <strong style={{ color: 'var(--success)' }}>Placet Juxta Modum</strong> to approve with a condition.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Already voted motions — locked */}
          {motions.filter(m => existingVotes[m.id]).map(m => {
            const ev = existingVotes[m.id]
            const voteColor = VOTE_COLORS[ev.vote] || 'var(--text-muted)'
            return (
              <div key={m.id} style={{
                background: `${voteColor}08`,
                border: `1px solid ${voteColor}30`,
                borderRadius: 'var(--radius-lg)', padding: '16px 20px',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: ev.comment ? '10px' : '0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Lock size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{m.title}</span>
                  </div>
                  <span style={{
                    fontSize: '12px', fontWeight: 700,
                    color: voteColor,
                    background: `${voteColor}15`,
                    padding: '3px 10px', borderRadius: '12px',
                  }}>
                    {VOTE_LABELS[ev.vote] || ev.vote}
                  </span>
                </div>
                {ev.comment && (
                  <div style={{
                    fontSize: '13px', color: 'var(--text-muted)',
                    fontStyle: 'italic', paddingLeft: '24px',
                  }}>
                    "{ev.comment}"
                  </div>
                )}
              </div>
            )
          })}

          {/* Pending motions */}
          {pendingMotions.map(motion => (
            <MotionVoteCard
              key={motion.id}
              motion={motion}
              selectedVote={votes[motion.id]}
              comment={comments[motion.id] || ''}
              onVote={v => handleVote(motion.id, v)}
              onCommentChange={v => setComments(prev => ({ ...prev, [motion.id]: v }))}
            />
          ))}

          {pendingMotions.length > 0 && (
            <Button
              fullWidth size="lg"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!allPendingVoted}
            >
              Submit Votes
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
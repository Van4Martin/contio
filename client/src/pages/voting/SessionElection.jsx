// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { ArrowLeft, CheckCircle } from 'lucide-react'
// import Navbar from '../../components/layout/Navbar'
// import CandidateSelect from '../../components/voting/CandidateSelect'
// import ManualEntry from '../../components/voting/ManualEntry'
// import Button from '../../components/common/Button'
// import Loader from '../../components/common/Loader'
// import { useVoting } from '../../hooks/useVoting'

// export default function SessionElection() {
//   const { meetingId, sessionId } = useParams()
//   const navigate = useNavigate()
//   const { categories, userVotes, loading, loadCategoriesWithCandidates, votePeople } = useVoting()
//   const [votes, setVotes] = useState({})
//   const [submitting, setSubmitting] = useState(false)

//   useEffect(() => { loadCategoriesWithCandidates(sessionId) }, [sessionId])

//   const setVoteForCategory = (categoryId, patch) => {
//     setVotes(prev => ({ ...prev, [categoryId]: { ...prev[categoryId], ...patch } }))
//   }

//   const handleSubmit = async () => {
//     const missing = categories.filter(cat => {
//       const v = votes[cat.id]
//       return !v?.candidateId && !v?.manualName?.trim()
//     })
//     if (missing.length > 0) {
//       import('react-hot-toast').then(({ default: toast }) =>
//         toast.error(`Please vote in: ${missing.map(c => c.title).join(', ')}`)
//       )
//       return
//     }
//     setSubmitting(true)
//     for (const cat of categories) {
//       const v = votes[cat.id]
//       await votePeople({ sessionId, meetingId, categoryId: cat.id, candidateId: v.candidateId || null, manualName: v.manualName?.trim() || null })
//     }
//     setSubmitting(false)
//     navigate(`/meeting/${meetingId}`)
//   }

//   const allVoted = categories.length > 0 && categories.every(cat => {
//     const v = votes[cat.id]
//     return v?.candidateId || v?.manualName?.trim()
//   })
//   const completedCount = categories.filter(cat => {
//     const v = votes[cat.id]
//     return v?.candidateId || v?.manualName?.trim()
//   }).length

//   if (loading) return <><Navbar /><Loader /></>

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
//       <Navbar />
//       <main style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
//         <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
//           <ArrowLeft size={15} /> Back
//         </button>
//         <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Election Ballot</h1>
//         <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>Vote in each category. Your selections are independent per position.</p>

//         {categories.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>
//             No voting categories have been set up for this election.
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//             {categories.map((category, idx) => {
//               const v = votes[category.id] || {}
//               const hasVoted = v.candidateId || v.manualName?.trim()
//               return (
//                 <div key={category.id} className="fade-in" style={{
//                   background: 'var(--bg-surface)',
//                   border: `1px solid ${hasVoted ? 'rgba(59,130,246,0.35)' : 'var(--border)'}`,
//                   borderRadius: 'var(--radius-lg)', overflow: 'hidden',
//                   transition: 'border-color 0.3s', animationDelay: `${idx * 0.07}s`,
//                 }}>
//                   <div style={{
//                     display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                     padding: '14px 20px',
//                     background: hasVoted ? 'var(--accent-dim)' : 'var(--bg-elevated)',
//                     borderBottom: '1px solid var(--border)', transition: 'background 0.3s',
//                   }}>
//                     <div>
//                       <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>{category.title}</div>
//                       {category.description && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{category.description}</div>}
//                     </div>
//                     {hasVoted && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent)', fontSize: '12px', fontWeight: 600 }}><CheckCircle size={14} /> Voted</div>}
//                   </div>
//                   <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                     {category.candidates?.length > 0 && (
//                       <CandidateSelect
//                         candidates={category.candidates}
//                         selected={v.candidateId}
//                         onSelect={id => setVoteForCategory(category.id, { candidateId: id, manualName: '' })}
//                       />
//                     )}
//                     <ManualEntry
//                       value={v.manualName || ''}
//                       onChange={name => setVoteForCategory(category.id, { manualName: name, candidateId: null })}
//                       placeholder={`Write in a candidate for ${category.title}...`}
//                     />
//                   </div>
//                 </div>
//               )
//             })}

//             {/* Progress */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-secondary)' }}>
//               <div style={{ flex: 1, height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
//                 <div style={{ height: '100%', width: `${categories.length > 0 ? completedCount / categories.length * 100 : 0}%`, background: 'var(--accent)', borderRadius: '2px', transition: 'width 0.4s ease' }} />
//               </div>
//               <span>{completedCount} / {categories.length} completed</span>
//             </div>

//             <Button fullWidth size="lg" onClick={handleSubmit} loading={submitting} disabled={!allVoted}>
//               Submit Ballot
//             </Button>
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }


import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import CandidateSelect from '../../components/voting/CandidateSelect'
import ManualEntry from '../../components/voting/ManualEntry'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { useVoting } from '../../hooks/useVoting'
import { votingService } from '../../services/votingService'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function SessionElection() {
  const { meetingId, sessionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { categories, loading, loadCategoriesWithCandidates, votePeople } = useVoting()

  const [votes, setVotes]           = useState({})
  const [alreadyVoted, setAlreadyVoted] = useState(new Set()) // categoryIds already voted
  const [submitting, setSubmitting] = useState(false)
  const [checkingVotes, setCheckingVotes] = useState(true)

  useEffect(() => {
    const init = async () => {
      await loadCategoriesWithCandidates(sessionId)
      // Check existing votes
      if (user?.id) {
        const existing = await votingService.getUserPeopleVotes(user.id, sessionId)
        const votedSet = new Set(existing.map(v => v.category_id))
        setAlreadyVoted(votedSet)
      }
      setCheckingVotes(false)
    }
    init()
  }, [sessionId, user?.id])

  const setVoteForCategory = (categoryId, patch) => {
    setVotes(prev => ({ ...prev, [categoryId]: { ...prev[categoryId], ...patch } }))
  }

  // Only show categories the user hasn't voted in yet
  const pendingCategories = categories.filter(cat => !alreadyVoted.has(cat.id))
  const allPendingVoted   = pendingCategories.length > 0 &&
    pendingCategories.every(cat => {
      const v = votes[cat.id]
      return v?.candidateId || v?.manualName?.trim()
    })

  const completedCount = pendingCategories.filter(cat => {
    const v = votes[cat.id]
    return v?.candidateId || v?.manualName?.trim()
  }).length

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      for (const cat of pendingCategories) {
        const v = votes[cat.id]
        await votePeople({
          sessionId, meetingId,
          categoryId: cat.id,
          candidateId: v.candidateId || null,
          manualName: v.manualName?.trim() || null,
        })
      }
      toast.success('Ballot submitted!')
      navigate(`/meeting/${meetingId}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || checkingVotes) return <><Navbar /><Loader /></>

  // All categories already voted
  if (alreadyVoted.size > 0 && pendingCategories.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
        <Navbar />
        <main style={{ maxWidth: '520px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--warning-dim)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--warning)' }}>
            <CheckCircle size={32} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>
            Ballot Already Submitted
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.7 }}>
            You have already cast your votes in all categories for this election.
          </p>
          <Button onClick={() => navigate(`/meeting/${meetingId}`)}>Back to Meeting</Button>
        </main>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back
        </button>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Election Ballot</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
          Vote in each category. Your selections are independent per position.
        </p>

        {/* Already voted categories — shown as locked */}
        {alreadyVoted.size > 0 && (
          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              Already voted
            </div>
            {categories.filter(cat => alreadyVoted.has(cat.id)).map(cat => (
              <div key={cat.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 'var(--radius-md)',
              }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{cat.title}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--warning)', fontWeight: 600 }}>
                  <CheckCircle size={13} /> Voted
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pending categories */}
        {pendingCategories.length === 0 ? null : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {pendingCategories.map((category, idx) => {
              const v        = votes[category.id] || {}
              const hasVoted = v.candidateId || v.manualName?.trim()

              return (
                <div key={category.id} className="fade-in" style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${hasVoted ? 'rgba(59,130,246,0.35)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                  transition: 'border-color 0.3s',
                  animationDelay: `${idx * 0.07}s`,
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px',
                    background: hasVoted ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.3s',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>{category.title}</div>
                      {category.description && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{category.description}</div>}
                    </div>
                    {hasVoted && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent)', fontSize: '12px', fontWeight: 600 }}>
                        <CheckCircle size={14} /> Selected
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {category.candidates?.length > 0 && (
                      <CandidateSelect
                        candidates={category.candidates}
                        selected={v.candidateId}
                        onSelect={cid => setVoteForCategory(category.id, { candidateId: cid, manualName: '' })}
                      />
                    )}
                    <ManualEntry
                      value={v.manualName || ''}
                      onChange={name => setVoteForCategory(category.id, { manualName: name, candidateId: null })}
                      placeholder={`Write in a candidate for ${category.title}...`}
                    />
                  </div>
                </div>
              )
            })}

            {/* Progress bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', background: 'var(--bg-elevated)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              fontSize: '13px', color: 'var(--text-secondary)',
            }}>
              <div style={{ flex: 1, height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pendingCategories.length > 0 ? completedCount / pendingCategories.length * 100 : 0}%`,
                  background: 'var(--accent)', borderRadius: '2px', transition: 'width 0.4s ease',
                }} />
              </div>
              <span>{completedCount} / {pendingCategories.length} completed</span>
            </div>

            <Button fullWidth size="lg" onClick={handleSubmit} loading={submitting} disabled={!allPendingVoted}>
              Submit Ballot
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
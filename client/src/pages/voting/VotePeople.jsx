// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { ArrowLeft } from 'lucide-react'
// import Navbar from '../../components/layout/Navbar'
// import CandidateSelect from '../../components/voting/CandidateSelect'
// import ManualEntry from '../../components/voting/ManualEntry'
// import Button from '../../components/common/Button'
// import Loader from '../../components/common/Loader'
// import { useVoting } from '../../hooks/useVoting'

// export default function VotePeople() {
//   const { id: meetingId, sectionId } = useParams()
//   const navigate = useNavigate()
//   const { candidates, userVotes, loading, loadCandidates, votePeople } = useVoting()
//   const [selectedCandidate, setSelectedCandidate] = useState(null)
//   const [manualName, setManualName] = useState('')
//   const [submitting, setSubmitting] = useState(false)

//   useEffect(() => { loadCandidates(sectionId) }, [sectionId])

//   const alreadyVoted = userVotes[`people_${sectionId}`]

//   const handleSubmit = async () => {
//     if (!selectedCandidate && !manualName.trim()) return
//     setSubmitting(true)
//     await votePeople({ sectionId, meetingId, candidateId: selectedCandidate, manualName: manualName.trim() })
//     setSubmitting(false)
//     navigate(`/meeting/${meetingId}/sections`)
//   }

//   if (loading) return <><Navbar /><Loader /></>

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
//       <Navbar />
//       <main style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
//         <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
//           <ArrowLeft size={15} /> Back
//         </button>
//         <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Election Vote</h1>
//         <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Select a candidate or enter a name manually.</p>

//         {alreadyVoted ? (
//           <div style={{ padding: '24px', background: 'var(--success-dim)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-lg)', color: 'var(--success)', textAlign: 'center' }}>
//             ✓ You have already voted in this election.
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//             {candidates.length > 0 && (
//               <CandidateSelect candidates={candidates} selected={selectedCandidate} onSelect={id => { setSelectedCandidate(id); setManualName('') }} />
//             )}
//             <ManualEntry value={manualName} onChange={v => { setManualName(v); setSelectedCandidate(null) }} />
//             <Button fullWidth size="lg" onClick={handleSubmit} loading={submitting} disabled={!selectedCandidate && !manualName.trim()}>
//               Submit Vote
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
import { votingService } from '../../services/votingService'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function VotePeople() {
  const { id: meetingId, sectionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // votes[categoryId] = { candidateId, manualName }
  const [votes, setVotes] = useState({})

  useEffect(() => {
    votingService.getCategoriesWithCandidates(sectionId)
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [sectionId])

  const setVoteForCategory = (categoryId, patch) => {
    setVotes(prev => ({ ...prev, [categoryId]: { ...prev[categoryId], ...patch } }))
  }

  const handleSubmit = async () => {
    const missing = categories.filter(cat => {
      const v = votes[cat.id]
      return !v?.candidateId && !v?.manualName?.trim()
    })
    if (missing.length > 0) {
      toast.error(`Please vote in all categories: ${missing.map(c => c.title).join(', ')}`)
      return
    }

    setSubmitting(true)
    try {
      for (const cat of categories) {
        const v = votes[cat.id]
        await votingService.submitPeopleVote({
          sectionId,
          meetingId,
          userId: user.id,
          categoryId: cat.id,
          candidateId: v.candidateId || null,
          manualName: v.manualName?.trim() || null,
        })
      }
      toast.success('All votes submitted!')
      navigate(`/meeting/${meetingId}/sections`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const allVoted = categories.length > 0 && categories.every(cat => {
    const v = votes[cat.id]
    return v?.candidateId || v?.manualName?.trim()
  })

  if (loading) return <><Navbar /><Loader /></>

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
          Election Ballot
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Vote in each category. Your selections are independent per position.
        </p>

        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>
            No voting categories have been set up for this election.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {categories.map((category, idx) => {
              const v = votes[category.id] || {}
              const hasVoted = v.candidateId || v.manualName?.trim()

              return (
                <div
                  key={category.id}
                  className="fade-in"
                  style={{
                    background: 'var(--bg-surface)',
                    border: `1px solid ${hasVoted ? 'rgba(59,130,246,0.35)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    transition: 'border-color 0.3s',
                    animationDelay: `${idx * 0.07}s`,
                  }}
                >
                  {/* Category header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px',
                    background: hasVoted ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.3s',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>
                        {category.title}
                      </div>
                      {category.description && (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {category.description}
                        </div>
                      )}
                    </div>
                    {hasVoted && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent)', fontSize: '12px', fontWeight: 600 }}>
                        <CheckCircle size={14} /> Voted
                      </div>
                    )}
                  </div>

                  {/* Candidates */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {category.candidates?.length > 0 && (
                      <CandidateSelect
                        candidates={category.candidates}
                        selected={v.candidateId}
                        onSelect={id => setVoteForCategory(category.id, { candidateId: id, manualName: '' })}
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

            {/* Progress indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px', color: 'var(--text-secondary)',
            }}>
              <div style={{ flex: 1, height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${categories.length > 0 ? (categories.filter(c => votes[c.id]?.candidateId || votes[c.id]?.manualName?.trim()).length / categories.length * 100) : 0}%`,
                  background: 'var(--accent)',
                  borderRadius: '2px',
                  transition: 'width 0.4s ease',
                }} />
              </div>
              <span>
                {categories.filter(c => votes[c.id]?.candidateId || votes[c.id]?.manualName?.trim()).length}
                {' / '}
                {categories.length} completed
              </span>
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!allVoted}
            >
              Submit Ballot
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
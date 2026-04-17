import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import CandidateSelect from '../../components/voting/CandidateSelect'
import ManualEntry from '../../components/voting/ManualEntry'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { useVoting } from '../../hooks/useVoting'

export default function VotePeople() {
  const { id: meetingId, sectionId } = useParams()
  const navigate = useNavigate()
  const { candidates, userVotes, loading, loadCandidates, votePeople } = useVoting()
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [manualName, setManualName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadCandidates(sectionId) }, [sectionId])

  const alreadyVoted = userVotes[`people_${sectionId}`]

  const handleSubmit = async () => {
    if (!selectedCandidate && !manualName.trim()) return
    setSubmitting(true)
    await votePeople({ sectionId, meetingId, candidateId: selectedCandidate, manualName: manualName.trim() })
    setSubmitting(false)
    navigate(`/meeting/${meetingId}/sections`)
  }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Election Vote</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Select a candidate or enter a name manually.</p>

        {alreadyVoted ? (
          <div style={{ padding: '24px', background: 'var(--success-dim)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-lg)', color: 'var(--success)', textAlign: 'center' }}>
            ✓ You have already voted in this election.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {candidates.length > 0 && (
              <CandidateSelect candidates={candidates} selected={selectedCandidate} onSelect={id => { setSelectedCandidate(id); setManualName('') }} />
            )}
            <ManualEntry value={manualName} onChange={v => { setManualName(v); setSelectedCandidate(null) }} />
            <Button fullWidth size="lg" onClick={handleSubmit} loading={submitting} disabled={!selectedCandidate && !manualName.trim()}>
              Submit Vote
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import MotionVoteCard from '../../components/voting/MotionVoteCard'
import CommentBox from '../../components/voting/CommentBox'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { useVoting } from '../../hooks/useVoting'

export default function VoteMotions() {
  const { id: meetingId, sectionId } = useParams()
  const navigate = useNavigate()
  const { motions, userVotes, loading, loadMotions, voteMotion } = useVoting()
  const [votes, setVotes] = useState({})
  const [comments, setComments] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadMotions(sectionId) }, [sectionId])

  const handleSubmit = async () => {
    setSubmitting(true)
    for (const motion of motions) {
      if (votes[motion.id]) {
        await voteMotion({ motionId: motion.id, sectionId, meetingId, vote: votes[motion.id], comment: comments[motion.id] || '' })
      }
    }
    setSubmitting(false)
    navigate(`/meeting/${meetingId}/sections`)
  }

  if (loading) return <><Navbar /><Loader /></>

  const allVoted = motions.length > 0 && motions.every(m => votes[m.id])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Motion Votes</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Vote on each motion and optionally add a comment.</p>

        {motions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>No motions in this section.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {motions.map(motion => (
              <div key={motion.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <MotionVoteCard motion={motion} selectedVote={votes[motion.id]} onVote={v => setVotes(prev => ({ ...prev, [motion.id]: v }))} />
                <CommentBox value={comments[motion.id] || ''} onChange={v => setComments(prev => ({ ...prev, [motion.id]: v }))} />
              </div>
            ))}
            <Button fullWidth size="lg" onClick={handleSubmit} loading={submitting} disabled={!allVoted}>
              Submit All Votes
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
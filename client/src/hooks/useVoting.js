import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { votingService } from '../services/votingService'
import { setCandidates, setMotions, recordVote, setResults, setLoading } from '../store/votingSlice'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export function useVoting() {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { candidates, motions, userVotes, results, loading } = useSelector(state => state.voting)

  const loadCandidates = useCallback(async (sectionId) => {
    dispatch(setLoading(true))
    try {
      const data = await votingService.getCandidates(sectionId)
      dispatch(setCandidates(data))
    } catch (err) {
      toast.error(err.message)
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const loadMotions = useCallback(async (sectionId) => {
    dispatch(setLoading(true))
    try {
      const data = await votingService.getMotions(sectionId)
      dispatch(setMotions(data))
    } catch (err) {
      toast.error(err.message)
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const votePeople = useCallback(async ({ sectionId, meetingId, candidateId, manualName }) => {
    if (!user?.id) return
    dispatch(setLoading(true))
    try {
      await votingService.submitPeopleVote({ sectionId, meetingId, userId: user.id, candidateId, manualName })
      dispatch(recordVote({ key: `people_${sectionId}`, value: candidateId || manualName }))
      toast.success('Vote submitted!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, user?.id])

  const voteMotion = useCallback(async ({ motionId, sectionId, meetingId, vote, comment }) => {
    if (!user?.id) return
    dispatch(setLoading(true))
    try {
      await votingService.submitMotionVote({ motionId, sectionId, meetingId, userId: user.id, vote, comment })
      dispatch(recordVote({ key: `motion_${motionId}`, value: vote }))
      toast.success('Vote recorded!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, user?.id])

  return { candidates, motions, userVotes, results, loading, loadCandidates, loadMotions, votePeople, voteMotion }
}
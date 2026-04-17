import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import SectionList from '../../components/attendance/SectionList'
import Loader from '../../components/common/Loader'
import { meetingService } from '../../services/meetingService'
import { useAttendance } from '../../hooks/useAttendance'
import { SECTION_TYPES } from '../../utils/constants'

export default function AttendancePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { checkIn, getUserAttendance, loading } = useAttendance()
  const [sections, setSections] = useState([])
  const [checkedInSections, setCheckedInSections] = useState([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [allSections, attended] = await Promise.all([
        meetingService.getMeetingSections(id),
        getUserAttendance(id),
      ])
      setSections(allSections.filter(s => s.type === SECTION_TYPES.ATTENDANCE || !s.type))
      setCheckedInSections(attended.map(a => a.section_id))
      setPageLoading(false)
    }
    load()
  }, [id])

  const handleCheckIn = async (sectionId) => {
    await checkIn(id, sectionId)
    setCheckedInSections(prev => [...prev, sectionId])
  }

  if (pageLoading) return <><Navbar /><Loader /></>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Attendance Check-In</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Check in for each section you are present for.</p>
        <SectionList sections={sections} checkedInSections={checkedInSections} onCheckIn={handleCheckIn} loading={loading} />
      </main>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Settings, BarChart2, ChevronRight } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import { meetingService } from '../../services/meetingService'
import { formatDateTime } from '../../utils/formatDate'
import { MEETING_STATUS } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function ManageMeetings() {
  const navigate = useNavigate()
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', scheduled_at: '', location: '', status: 'draft' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    meetingService.getAllMeetings().then(setMeetings).finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!form.title || !form.scheduled_at) { toast.error('Title and date are required'); return }
    setSaving(true)
    try {
      const m = await meetingService.createMeeting(form)
      setMeetings(prev => [m, ...prev])
      setShowModal(false)
      setForm({ title: '', description: '', scheduled_at: '', location: '', status: 'draft' })
      toast.success('Meeting created!')
    } catch (err) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this meeting? This cannot be undone.')) return
    try {
      await meetingService.deleteMeeting(id)
      setMeetings(prev => prev.filter(m => m.id !== id))
      toast.success('Meeting deleted.')
    } catch (err) { toast.error(err.message) }
  }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '4px' }}>Meetings</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{meetings.length} total meetings</p>
          </div>
          <Button icon={<Plus size={15} />} onClick={() => setShowModal(true)}>New Meeting</Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {meetings.map(m => (
            <div key={m.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{m.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{formatDateTime(m.scheduled_at)}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button size="sm" variant="secondary" icon={<Settings size={13} />} onClick={() => navigate(`/admin/sections/${m.id}`)}>Sections</Button>
                <Button size="sm" variant="ghost" icon={<BarChart2 size={13} />} onClick={() => navigate(`/admin/results/${m.id}`)}>Results</Button>
                <Button size="sm" variant="danger" icon={<Trash2 size={13} />} onClick={() => handleDelete(m.id)} />
              </div>
            </div>
          ))}
        </div>
      </main>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Meeting">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Annual General Meeting" />
          <Input label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" />
          <Input label="Date & Time" type="datetime-local" value={form.scheduled_at} onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))} />
          <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Conference Room A" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ padding: '11px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}>
              {Object.values(MEETING_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>Cancel</Button>
            <Button onClick={handleCreate} loading={saving} fullWidth>Create Meeting</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
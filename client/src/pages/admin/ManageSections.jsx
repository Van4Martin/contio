import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Users, Vote, ArrowLeft } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import { adminService } from '../../services/adminService'
import { meetingService } from '../../services/meetingService'
import { SECTION_TYPES } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function ManageSections() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'general', description: '', order_index: 0 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    meetingService.getMeetingSections(meetingId).then(setSections).finally(() => setLoading(false))
  }, [meetingId])

  const handleCreate = async () => {
    setSaving(true)
    try {
      const s = await adminService.createSection({ ...form, meeting_id: meetingId, order_index: sections.length })
      setSections(prev => [...prev, s])
      setShowModal(false)
      setForm({ title: '', type: 'general', description: '', order_index: 0 })
      toast.success('Section created!')
    } catch (err) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this section?')) return
    try {
      await adminService.deleteSection(id)
      setSections(prev => prev.filter(s => s.id !== id))
      toast.success('Section deleted.')
    } catch (err) { toast.error(err.message) }
  }

  const typeColors = { election: 'var(--warning)', motion: 'var(--accent)', attendance: 'var(--success)', general: 'var(--text-muted)' }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800 }}>Sections</h1>
          <Button icon={<Plus size={15} />} onClick={() => setShowModal(true)}>Add Section</Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sections.map(s => (
            <div key={s.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{s.title}</div>
                <span style={{ fontSize: '12px', color: typeColors[s.type] || 'var(--text-muted)', background: `${typeColors[s.type]}18`, padding: '3px 8px', borderRadius: '10px', textTransform: 'capitalize' }}>{s.type}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {s.type === SECTION_TYPES.ELECTION && (
                  <Button size="sm" variant="secondary" icon={<Users size={13} />} onClick={() => navigate(`/admin/candidates/${s.id}`)}>Candidates</Button>
                )}
                {s.type === SECTION_TYPES.MOTION && (
                  <Button size="sm" variant="secondary" icon={<Vote size={13} />} onClick={() => navigate(`/admin/motions/${s.id}`)}>Motions</Button>
                )}
                <Button size="sm" variant="danger" icon={<Trash2 size={13} />} onClick={() => handleDelete(s.id)} />
              </div>
            </div>
          ))}
        </div>
      </main>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Section title" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ padding: '11px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}>
              {Object.values(SECTION_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <Input label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional" />
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>Cancel</Button>
            <Button onClick={handleCreate} loading={saving} fullWidth>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
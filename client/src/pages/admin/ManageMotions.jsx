import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import { adminService } from '../../services/adminService'
import { votingService } from '../../services/votingService'
import toast from 'react-hot-toast'

export default function ManageMotions() {
  const { sectionId } = useParams()
  const navigate = useNavigate()
  const [motions, setMotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    votingService.getMotions(sectionId).then(setMotions).finally(() => setLoading(false))
  }, [sectionId])

  const handleCreate = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    try {
      const m = await adminService.createMotion({ ...form, section_id: sectionId })
      setMotions(prev => [...prev, m])
      setShowModal(false)
      setForm({ title: '', description: '' })
      toast.success('Motion added!')
    } catch (err) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this motion?')) return
    try {
      await adminService.deleteMotion(id)
      setMotions(prev => prev.filter(m => m.id !== id))
      toast.success('Motion deleted.')
    } catch (err) { toast.error(err.message) }
  }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800 }}>Motions</h1>
          <Button icon={<Plus size={15} />} onClick={() => setShowModal(true)}>Add Motion</Button>
        </div>

        {motions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>No motions yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {motions.map(m => (
              <div key={m.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{m.title}</div>
                  {m.description && <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{m.description}</div>}
                </div>
                <Button size="sm" variant="danger" icon={<Trash2 size={13} />} onClick={() => handleDelete(m.id)} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Motion">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Motion Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Approve 2025 budget" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Additional context..." rows={3} style={{ padding: '11px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>Cancel</Button>
            <Button onClick={handleCreate} loading={saving} fullWidth>Add Motion</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
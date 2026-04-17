import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, User } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import { adminService } from '../../services/adminService'
import { votingService } from '../../services/votingService'
import toast from 'react-hot-toast'

export default function ManageCandidates() {
  const { sectionId } = useParams()
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', bio: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    votingService.getCandidates(sectionId).then(setCandidates).finally(() => setLoading(false))
  }, [sectionId])

  const handleCreate = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      const c = await adminService.createCandidate({ ...form, section_id: sectionId })
      setCandidates(prev => [...prev, c])
      setShowModal(false)
      setForm({ name: '', bio: '' })
      toast.success('Candidate added!')
    } catch (err) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this candidate?')) return
    try {
      await adminService.deleteCandidate(id)
      setCandidates(prev => prev.filter(c => c.id !== id))
      toast.success('Candidate removed.')
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
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800 }}>Candidates</h1>
          <Button icon={<Plus size={15} />} onClick={() => setShowModal(true)}>Add Candidate</Button>
        </div>

        {candidates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>No candidates yet. Add the first one.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {candidates.map(c => (
              <div key={c.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <User size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    {c.bio && <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{c.bio}</div>}
                  </div>
                </div>
                <Button size="sm" variant="danger" icon={<Trash2 size={13} />} onClick={() => handleDelete(c.id)} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Candidate">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Candidate name" />
          <Input label="Bio / Position" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Optional short bio" />
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>Cancel</Button>
            <Button onClick={handleCreate} loading={saving} fullWidth>Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
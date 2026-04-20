import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'

export default function ManageElectionCategories() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const [showCatModal, setShowCatModal] = useState(false)
  const [catForm, setCatForm] = useState({ title: '', description: '', max_votes: 1 })
  const [savingCat, setSavingCat] = useState(false)
  const [showCandModal, setShowCandModal] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [candForm, setCandForm] = useState({ name: '', bio: '' })
  const [savingCand, setSavingCand] = useState(false)

  useEffect(() => {
    adminService.getCategoriesBySession(sessionId)
      .then(data => {
        setCategories(data)
        const exp = {}
        data.forEach(c => { exp[c.id] = true })
        setExpanded(exp)
      })
      .finally(() => setLoading(false))
  }, [sessionId])

  const handleCreateCategory = async () => {
    if (!catForm.title.trim()) { toast.error('Title required'); return }
    setSavingCat(true)
    try {
      const c = await adminService.createCategory({ ...catForm, session_id: sessionId, order_index: categories.length })
      c.candidates = []
      setCategories(prev => [...prev, c])
      setExpanded(prev => ({ ...prev, [c.id]: true }))
      setShowCatModal(false)
      setCatForm({ title: '', description: '', max_votes: 1 })
      toast.success('Category created!')
    } catch (err) { toast.error(err.message) }
    finally { setSavingCat(false) }
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await adminService.deleteCategory(id)
      setCategories(prev => prev.filter(c => c.id !== id))
    } catch (err) { toast.error(err.message) }
  }

  const handleCreateCandidate = async () => {
    if (!candForm.name.trim()) { toast.error('Name required'); return }
    setSavingCand(true)
    try {
      const candidate = await adminService.createCandidate({ ...candForm, category_id: activeCategoryId, session_id: sessionId })
      setCategories(prev => prev.map(cat =>
        cat.id === activeCategoryId ? { ...cat, candidates: [...(cat.candidates || []), candidate] } : cat
      ))
      setShowCandModal(false)
      setCandForm({ name: '', bio: '' })
      toast.success('Candidate added!')
    } catch (err) { toast.error(err.message) }
    finally { setSavingCand(false) }
  }

  const handleDeleteCandidate = async (categoryId, candidateId) => {
    try {
      await adminService.deleteCandidate(candidateId)
      setCategories(prev => prev.map(cat =>
        cat.id === categoryId ? { ...cat, candidates: cat.candidates.filter(c => c.id !== candidateId) } : cat
      ))
    } catch (err) { toast.error(err.message) }
  }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, marginBottom: '4px' }}>Election Categories</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Each category is an independent race with its own candidate pool.</p>
          </div>
          <Button icon={<Plus size={15} />} onClick={() => setShowCatModal(true)}>New Category</Button>
        </div>

        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🗳️</div>
            <p>No categories yet. Create categories like "President", "Secretary", etc.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categories.map((category, catIdx) => {
              const isExpanded = expanded[category.id]
              const candidateCount = category.candidates?.length || 0
              return (
                <div key={category.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'var(--bg-elevated)', borderBottom: isExpanded ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-md)', background: 'var(--accent-dim)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                        {catIdx + 1}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{category.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{candidateCount} candidate{candidateCount !== 1 ? 's' : ''}{category.max_votes > 1 ? ` · Pick up to ${category.max_votes}` : ''}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Button size="sm" variant="secondary" icon={<Plus size={13} />} onClick={() => { setActiveCategoryId(category.id); setCandForm({ name: '', bio: '' }); setShowCandModal(true) }}>Add Candidate</Button>
                      <Button size="sm" variant="danger" icon={<Trash2 size={13} />} onClick={() => handleDeleteCategory(category.id)} />
                      <button onClick={() => setExpanded(prev => ({ ...prev, [category.id]: !isExpanded }))} style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: '12px' }}>
                      {candidateCount === 0 ? (
                        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>No candidates yet.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {category.candidates.map(candidate => (
                            <div key={candidate.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--text-muted)' }}>
                                  {candidate.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{candidate.name}</div>
                                  {candidate.bio && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{candidate.bio}</div>}
                                </div>
                              </div>
                              <Button size="sm" variant="danger" icon={<Trash2 size={12} />} onClick={() => handleDeleteCandidate(category.id, candidate.id)} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Modal isOpen={showCatModal} onClose={() => setShowCatModal(false)} title="New Election Category">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Category Title" value={catForm.title} onChange={e => setCatForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. President, Secretary" />
          <Input label="Description (optional)" value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" />
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setShowCatModal(false)} fullWidth>Cancel</Button>
            <Button onClick={handleCreateCategory} loading={savingCat} fullWidth>Create</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showCandModal} onClose={() => setShowCandModal(false)} title={`Add Candidate — ${categories.find(c => c.id === activeCategoryId)?.title || ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Full Name" value={candForm.name} onChange={e => setCandForm(f => ({ ...f, name: e.target.value }))} placeholder="Candidate name" />
          <Input label="Bio (optional)" value={candForm.bio} onChange={e => setCandForm(f => ({ ...f, bio: e.target.value }))} placeholder="Short background" />
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setShowCandModal(false)} fullWidth>Cancel</Button>
            <Button onClick={handleCreateCandidate} loading={savingCand} fullWidth>Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
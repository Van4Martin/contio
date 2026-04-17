import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, User, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'

export default function ManageCategories() {
  const { sectionId } = useParams()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})

  // Category modal
  const [showCatModal, setShowCatModal] = useState(false)
  const [catForm, setCatForm] = useState({ title: '', description: '', max_votes: 1 })
  const [savingCat, setSavingCat] = useState(false)

  // Candidate modal
  const [showCandModal, setShowCandModal] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [candForm, setCandForm] = useState({ name: '', bio: '' })
  const [savingCand, setSavingCand] = useState(false)

  useEffect(() => {
    adminService.getCategories(sectionId)
      .then(data => {
        setCategories(data)
        // Expand all by default
        const exp = {}
        data.forEach(c => { exp[c.id] = true })
        setExpanded(exp)
      })
      .finally(() => setLoading(false))
  }, [sectionId])

  // ── Category CRUD ────────────────────────────────────────────
  const handleCreateCategory = async () => {
    if (!catForm.title.trim()) { toast.error('Category title is required'); return }
    setSavingCat(true)
    try {
      const c = await adminService.createCategory({
        ...catForm,
        section_id: sectionId,
        order_index: categories.length,
      })
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
    if (!confirm('Delete this category and all its candidates?')) return
    try {
      await adminService.deleteCategory(id)
      setCategories(prev => prev.filter(c => c.id !== id))
      toast.success('Category deleted.')
    } catch (err) { toast.error(err.message) }
  }

  // ── Candidate CRUD ───────────────────────────────────────────
  const openCandModal = (categoryId) => {
    setActiveCategoryId(categoryId)
    setCandForm({ name: '', bio: '' })
    setShowCandModal(true)
  }

  const handleCreateCandidate = async () => {
    if (!candForm.name.trim()) { toast.error('Candidate name is required'); return }
    setSavingCand(true)
    try {
      const candidate = await adminService.createCandidate({
        ...candForm,
        category_id: activeCategoryId,
        section_id: sectionId,
      })
      setCategories(prev => prev.map(cat =>
        cat.id === activeCategoryId
          ? { ...cat, candidates: [...(cat.candidates || []), candidate] }
          : cat
      ))
      setShowCandModal(false)
      setCandForm({ name: '', bio: '' })
      toast.success('Candidate added!')
    } catch (err) { toast.error(err.message) }
    finally { setSavingCand(false) }
  }

  const handleDeleteCandidate = async (categoryId, candidateId) => {
    if (!confirm('Remove this candidate?')) return
    try {
      await adminService.deleteCandidate(candidateId)
      setCategories(prev => prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, candidates: cat.candidates.filter(c => c.id !== candidateId) }
          : cat
      ))
      toast.success('Candidate removed.')
    } catch (err) { toast.error(err.message) }
  }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">

        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
              Voting Categories
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Each category is an independent race. Candidates only appear in their own category.
            </p>
          </div>
          <Button icon={<Plus size={15} />} onClick={() => setShowCatModal(true)}>
            New Category
          </Button>
        </div>

        {/* Empty state */}
        {categories.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🗳️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'var(--text-primary)' }}>
              No categories yet
            </h3>
            <p style={{ fontSize: '14px' }}>
              Create categories like "President", "Secretary", etc. then add candidates to each.
            </p>
          </div>
        )}

        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {categories.map((category, catIdx) => {
            const isExpanded = expanded[category.id]
            const candidateCount = category.candidates?.length || 0

            return (
              <div
                key={category.id}
                className="fade-in"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  animationDelay: `${catIdx * 0.06}s`,
                }}
              >
                {/* Category Header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
                  background: 'var(--bg-elevated)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--accent-dim)',
                      border: '1px solid rgba(59,130,246,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '15px',
                    }}>
                      {catIdx + 1}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>
                        {category.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {candidateCount} candidate{candidateCount !== 1 ? 's' : ''}
                        {category.max_votes > 1 && ` · Pick up to ${category.max_votes}`}
                        {category.description && ` · ${category.description}`}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<Plus size={13} />}
                      onClick={() => openCandModal(category.id)}
                    >
                      Add Candidate
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      icon={<Trash2 size={13} />}
                      onClick={() => handleDeleteCategory(category.id)}
                    />
                    <button
                      onClick={() => setExpanded(prev => ({ ...prev, [category.id]: !isExpanded }))}
                      style={{
                        width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--bg-hover)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Candidates List */}
                {isExpanded && (
                  <div style={{ padding: '12px' }}>
                    {candidateCount === 0 ? (
                      <div style={{
                        textAlign: 'center', padding: '28px',
                        color: 'var(--text-muted)', fontSize: '13px',
                        border: '1px dashed var(--border)',
                        borderRadius: 'var(--radius-md)',
                      }}>
                        No candidates yet — click "Add Candidate" to add the first one.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {category.candidates.map((candidate, candIdx) => (
                          <div
                            key={candidate.id}
                            className="slide-in"
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '12px 14px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-md)',
                              animationDelay: `${candIdx * 0.04}s`,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'var(--bg-hover)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--text-muted)', fontSize: '13px', fontWeight: 700,
                                fontFamily: 'var(--font-display)',
                              }}>
                                {candidate.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '14px' }}>{candidate.name}</div>
                                {candidate.bio && (
                                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    {candidate.bio}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="danger"
                              icon={<Trash2 size={12} />}
                              onClick={() => handleDeleteCandidate(category.id, candidate.id)}
                            />
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
      </main>

      {/* Create Category Modal */}
      <Modal isOpen={showCatModal} onClose={() => setShowCatModal(false)} title="New Voting Category">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Category Title"
            value={catForm.title}
            onChange={e => setCatForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. President, Secretary, Treasurer"
          />
          <Input
            label="Description (optional)"
            value={catForm.description}
            onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Brief description of this role"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Max Votes Per Voter
            </label>
            <input
              type="number"
              min={1}
              value={catForm.max_votes}
              onChange={e => setCatForm(f => ({ ...f, max_votes: parseInt(e.target.value) || 1 }))}
              style={{
                padding: '11px 14px',
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                fontSize: '14px', outline: 'none',
              }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              How many candidates a voter can select in this category
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setShowCatModal(false)} fullWidth>Cancel</Button>
            <Button onClick={handleCreateCategory} loading={savingCat} fullWidth>Create Category</Button>
          </div>
        </div>
      </Modal>

      {/* Add Candidate Modal */}
      <Modal isOpen={showCandModal} onClose={() => setShowCandModal(false)} title={`Add Candidate — ${categories.find(c => c.id === activeCategoryId)?.title || ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Full Name"
            value={candForm.name}
            onChange={e => setCandForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Candidate's full name"
          />
          <Input
            label="Bio / Position (optional)"
            value={candForm.bio}
            onChange={e => setCandForm(f => ({ ...f, bio: e.target.value }))}
            placeholder="Short background or position statement"
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setShowCandModal(false)} fullWidth>Cancel</Button>
            <Button onClick={handleCreateCandidate} loading={savingCand} fullWidth>Add Candidate</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
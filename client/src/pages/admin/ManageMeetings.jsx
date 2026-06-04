// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Plus, Trash2, Settings, BarChart2, ChevronRight } from 'lucide-react'
// import Navbar from '../../components/layout/Navbar'
// import Button from '../../components/common/Button'
// import Modal from '../../components/common/Modal'
// import Input from '../../components/common/Input'
// import Loader from '../../components/common/Loader'
// import { meetingService } from '../../services/meetingService'
// import { formatDateTime } from '../../utils/formatDate'
// import { MEETING_STATUS } from '../../utils/constants'
// import toast from 'react-hot-toast'

// export default function ManageMeetings() {
//   const navigate = useNavigate()
//   const [meetings, setMeetings] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showModal, setShowModal] = useState(false)
//   const [form, setForm] = useState({ title: '', description: '', scheduled_at: '', location: '', status: 'draft' })
//   const [saving, setSaving] = useState(false)

//   useEffect(() => {
//     meetingService.getAllMeetings().then(setMeetings).finally(() => setLoading(false))
//   }, [])

//   const handleCreate = async () => {
//     if (!form.title || !form.scheduled_at) { toast.error('Title and date are required'); return }
//     setSaving(true)
//     try {
//       const m = await meetingService.createMeeting(form)
//       setMeetings(prev => [m, ...prev])
//       setShowModal(false)
//       setForm({ title: '', description: '', scheduled_at: '', location: '', status: 'draft' })
//       toast.success('Meeting created!')
//     } catch (err) { toast.error(err.message) }
//     finally { setSaving(false) }
//   }

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this meeting? This cannot be undone.')) return
//     try {
//       await meetingService.deleteMeeting(id)
//       setMeetings(prev => prev.filter(m => m.id !== id))
//       toast.success('Meeting deleted.')
//     } catch (err) { toast.error(err.message) }
//   }

//   if (loading) return <><Navbar /><Loader /></>

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
//       <Navbar />
//       <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
//           <div>
//             <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '4px' }}>Meetings</h1>
//             <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{meetings.length} total meetings</p>
//           </div>
//           <Button icon={<Plus size={15} />} onClick={() => setShowModal(true)}>New Meeting</Button>
//         </div>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//           {meetings.map(m => (
//             <div key={m.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <div>
//                 <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{m.title}</div>
//                 <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{formatDateTime(m.scheduled_at)}</div>
//               </div>
//               <div style={{ display: 'flex', gap: '8px' }}>
//                 <Button size="sm" variant="secondary" icon={<Settings size={13} />} onClick={() => navigate(`/admin/sections/${m.id}`)}>Sections</Button>
//                 <Button size="sm" variant="ghost" icon={<BarChart2 size={13} />} onClick={() => navigate(`/admin/results/${m.id}`)}>Results</Button>
//                 <Button size="sm" variant="danger" icon={<Trash2 size={13} />} onClick={() => handleDelete(m.id)} />
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>

//       <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Meeting">
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//           <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Annual General Meeting" />
//           <Input label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" />
//           <Input label="Date & Time" type="datetime-local" value={form.scheduled_at} onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))} />
//           <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Conference Room A" />
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
//             <label style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Status</label>
//             <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ padding: '11px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}>
//               {Object.values(MEETING_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
//             </select>
//           </div>
//           <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
//             <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>Cancel</Button>
//             <Button onClick={handleCreate} loading={saving} fullWidth>Create Meeting</Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   )
// }



// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   Plus, Trash2, Settings, BarChart2,
//   XCircle, CheckCircle, PlayCircle, Send
// } from 'lucide-react'
// import Navbar from '../../components/layout/Navbar'
// import Button from '../../components/common/Button'
// import Modal from '../../components/common/Modal'
// import Input from '../../components/common/Input'
// import Loader from '../../components/common/Loader'
// import { meetingService } from '../../services/meetingService'
// import { formatDateTime } from '../../utils/formatDate'
// import { MEETING_STATUS } from '../../utils/constants'
// import toast from 'react-hot-toast'

// const STATUS_CONFIG = {
//   draft:     { color: 'var(--text-muted)',  label: 'Draft' },
//   scheduled: { color: 'var(--warning)',      label: 'Scheduled' },
//   active:    { color: 'var(--success)',      label: 'Active' },
//   completed: { color: 'var(--accent)',       label: 'Completed' },
//   cancelled: { color: 'var(--danger)',       label: 'Cancelled' },
// }

// export default function ManageMeetings() {
//   const navigate = useNavigate()
//   const [meetings, setMeetings] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [form, setForm] = useState({ title: '', description: '', scheduled_at: '', location: '', status: 'draft' })
//   const [saving, setSaving] = useState(false)
//   const [actionLoadingId, setActionLoadingId] = useState(null)
//   const [confirm, setConfirm] = useState(null)

//   useEffect(() => {
//     meetingService.getAllMeetings().then(setMeetings).finally(() => setLoading(false))
//   }, [])

//   const handleCreate = async () => {
//     if (!form.title || !form.scheduled_at) { toast.error('Title and date required'); return }
//     setSaving(true)
//     try {
//       const m = await meetingService.createMeeting(form)
//       setMeetings(prev => [m, ...prev])
//       setShowCreateModal(false)
//       setForm({ title: '', description: '', scheduled_at: '', location: '', status: 'draft' })
//       toast.success('Meeting created!')
//     } catch (err) { toast.error(err.message) }
//     finally { setSaving(false) }
//   }

//   const handleStatusAction = async (id, action) => {
//     setActionLoadingId(id)
//     try {
//       let updated
//       if (action === 'schedule')   updated = await meetingService.scheduleMeeting(id)
//       else if (action === 'activate') updated = await meetingService.activateMeeting(id)
//       else if (action === 'cancel')   updated = await meetingService.cancelMeeting(id)
//       else if (action === 'end')      updated = await meetingService.endMeeting(id)
//       setMeetings(prev => prev.map(m => m.id === id ? updated : m))
//       toast.success({
//         schedule: 'Meeting scheduled.',
//         activate: 'Meeting is now active.',
//         cancel: 'Meeting cancelled.',
//         end: 'Meeting ended.',
//       }[action])
//     } catch (err) { toast.error(err.message) }
//     finally { setActionLoadingId(null); setConfirm(null) }
//   }

//   const handleDelete = async (id) => {
//     try {
//       await meetingService.deleteMeeting(id)
//       setMeetings(prev => prev.filter(m => m.id !== id))
//       toast.success('Meeting deleted.')
//     } catch (err) { toast.error(err.message) }
//     finally { setConfirm(null) }
//   }

//   const getStatusActions = (meeting) => {
//     const { id, status } = meeting
//     const isLoading = actionLoadingId === id
//     const btns = []

//     if (status === 'draft') {
//       btns.push(
//         <Button key="schedule" size="sm" variant="secondary" icon={<Send size={13} />} loading={isLoading}
//           onClick={() => setConfirm({ id, action: 'schedule', message: 'Schedule this meeting? Its status will change to Scheduled.', variant: 'primary' })}>
//           Schedule
//         </Button>
//       )
//     }
//     if (status === 'scheduled') {
//       btns.push(
//         <Button key="activate" size="sm" variant="success" icon={<PlayCircle size={13} />} loading={isLoading}
//           onClick={() => (id, 'activate')}>
//           Start
//         </Button>,
//         <Button key="cancel" size="sm" variant="danger" icon={<XCircle size={13} />} loading={isLoading}
//           onClick={() => setConfirm({ id, action: 'cancel', message: 'Cancel this scheduled meeting? This cannot be undone.', variant: 'danger' })}>
//           Cancel
//         </Button>
//       )
//     }
//     if (status === 'active') {
//       btns.push(
//         <Button key="end" size="sm" icon={<CheckCircle size={13} />} loading={isLoading}
//           style={{ background: 'var(--success)', color: '#fff', border: 'none' }}
//           onClick={() => setConfirm({ id, action: 'end', message: 'End this meeting? It will be marked as completed.', variant: 'primary' })}>
//           End Meeting
//         </Button>
//       )
//     }
//     return btns
//   }

//   if (loading) return <><Navbar /><Loader /></>

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
//       <Navbar />
//       <main style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">

//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
//           <div>
//             <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '4px' }}>Meetings</h1>
//             <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{meetings.length} total meetings</p>
//           </div>
//           <Button icon={<Plus size={15} />} onClick={() => setShowCreateModal(true)}>New Meeting</Button>
//         </div>

//         {meetings.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '80px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>
//             No meetings yet.
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//             {meetings.map(m => {
//               const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.draft
//               return (
//                 <div key={m.id} style={{
//                   background: 'var(--bg-surface)', border: '1px solid var(--border)',
//                   borderRadius: 'var(--radius-lg)', padding: '16px 20px',
//                   display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                   gap: '16px', flexWrap: 'wrap',
//                 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
//                     <div style={{
//                       width: '46px', height: '46px', flexShrink: 0,
//                       borderRadius: 'var(--radius-md)',
//                       background: `${cfg.color}14`, border: `1px solid ${cfg.color}30`,
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       color: cfg.color, fontSize: '10px', fontWeight: 700,
//                       textTransform: 'uppercase', letterSpacing: '0.03em', textAlign: 'center', lineHeight: 1.2, padding: '4px',
//                     }}>
//                       {cfg.label}
//                     </div>
//                     <div style={{ minWidth: 0 }}>
//                       <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '15px', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                         {m.title}
//                       </div>
//                       <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
//                         📅 {formatDateTime(m.scheduled_at)}{m.location ? `  📍 ${m.location}` : ''}
//                       </div>
//                     </div>
//                   </div>

//                   <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
//                     {getStatusActions(m)}
//                     <Button size="sm" variant="secondary" icon={<Settings size={13} />}
//                       onClick={() => navigate(`/admin/sessions/${m.id}`)}>
//                       Sessions
//                     </Button>
//                     <Button size="sm" variant="ghost" icon={<BarChart2 size={13} />}
//                       onClick={() => navigate(`/admin/results/${m.id}`)}>
//                       Results
//                     </Button>
//                     {['draft', 'cancelled', 'completed'].includes(m.status) && (
//                       <Button size="sm" variant="danger" icon={<Trash2 size={13} />}
//                         onClick={() => setConfirm({ id: m.id, action: 'delete', message: 'Permanently delete this meeting?', variant: 'danger' })} />
//                     )}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         )}
//       </main>

//       {/* Create modal */}
//       <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="New Meeting">
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//           <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Annual General Meeting" />
//           <Input label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional" />
//           <Input label="Date & Time" type="datetime-local" value={form.scheduled_at} onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))} />
//           <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Conference Room A" />
//           <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
//             <Button variant="secondary" onClick={() => setShowCreateModal(false)} fullWidth>Cancel</Button>
//             <Button onClick={handleCreate} loading={saving} fullWidth>Create</Button>
//           </div>
//         </div>
//       </Modal>

//       {/* Confirm modal */}
//       <Modal isOpen={!!confirm} onClose={() => setConfirm(null)} title="Confirm" width="400px">
//         {confirm && (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//             <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
//               {confirm.message}
//             </p>
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <Button variant="secondary" onClick={() => setConfirm(null)} fullWidth>Cancel</Button>
//               <Button
//                 variant={confirm.variant === 'danger' ? 'danger' : 'primary'}
//                 loading={actionLoadingId === confirm.id}
//                 onClick={() => confirm.action === 'delete' ? handleDelete(confirm.id) : handleStatusAction(confirm.id, confirm.action)}
//                 fullWidth
//               >
//                 Confirm
//               </Button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   )
// }



import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Trash2, Settings, BarChart2,
  XCircle, CheckCircle, PlayCircle, Send
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import { meetingService } from '../../services/meetingService'
import { formatDateTime } from '../../utils/formatDate'
import { MEETING_STATUS } from '../../utils/constants'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  draft:     { color: 'var(--text-muted)',  label: 'Draft' },
  scheduled: { color: 'var(--warning)',     label: 'Scheduled' },
  active:    { color: 'var(--success)',     label: 'Active' },
  completed: { color: 'var(--accent)',      label: 'Completed' },
  cancelled: { color: 'var(--danger)',      label: 'Cancelled' },
}

export default function ManageMeetings() {
  const navigate = useNavigate()

  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // ✅ UPDATED FORM STATE (with geofencing)
  const [form, setForm] = useState({
    title: '',
    description: '',
    scheduled_at: '',
    location: '',
    status: 'draft',
    geofence_enabled: false,
    geofence_lat: '',
    geofence_lng: '',
    geofence_radius_meters: 100,
  })

  const [saving, setSaving] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [confirm, setConfirm] = useState(null)

  useEffect(() => {
    meetingService.getAllMeetings()
      .then(setMeetings)
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!form.title || !form.scheduled_at) {
      toast.error('Title and date required')
      return
    }

    setSaving(true)
    try {
      const m = await meetingService.createMeeting(form)
      setMeetings(prev => [m, ...prev])
      setShowCreateModal(false)

      // ✅ RESET FORM (with geofencing fields)
      setForm({
        title: '',
        description: '',
        scheduled_at: '',
        location: '',
        status: 'draft',
        geofence_enabled: false,
        geofence_lat: '',
        geofence_lng: '',
        geofence_radius_meters: 100,
      })

      toast.success('Meeting created!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

//   const handleStatusAction = async (id, action) => {
//   setActionLoadingId(id)
//   try {
//     let updated
//     if (action === 'schedule')      updated = await meetingService.scheduleMeeting(id)
//     else if (action === 'activate') updated = await meetingService.activateMeeting(id)
//     else if (action === 'cancel')   updated = await meetingService.cancelMeeting(id)
//     else if (action === 'end')      updated = await meetingService.endMeeting(id)

//     if (updated) {
//       setMeetings(prev => prev.map(m => m.id === id ? updated : m))
//     }

//     const messages = {
//       schedule: 'Meeting scheduled.',
//       activate: 'Meeting is now active.',
//       cancel:   'Meeting cancelled.',
//       end:      'Meeting ended.',
//     }
//     toast.success(messages[action] || 'Done.')

//   } catch (err) {
//     toast.error(err.message)
//   } finally {
//     setActionLoadingId(null)
//     setConfirm(null)
//   }
// }


    const handleStatusAction = async (id, action) => {
    setActionLoadingId(id)
    try {
      let updated
      if (action === 'schedule')   updated = await meetingService.scheduleMeeting(id)
      else if (action === 'activate') updated = await meetingService.activateMeeting(id)
      else if (action === 'cancel')   updated = await meetingService.cancelMeeting(id)
      else if (action === 'end')      updated = await meetingService.endMeeting(id)
      setMeetings(prev => prev.map(m => m.id === id ? updated : m))
      toast.success({
        schedule: 'Meeting scheduled.',
        activate: 'Meeting is now active.',
        cancel: 'Meeting cancelled.',
        end: 'Meeting ended.',
      }[action])
    } catch (err) { toast.error(err.message) }
    finally { setActionLoadingId(null); setConfirm(null) }
  }
  const handleDelete = async (id) => {
    try {
      await meetingService.deleteMeeting(id)
      setMeetings(prev => prev.filter(m => m.id !== id))
      toast.success('Meeting deleted.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setConfirm(null)
    }
  }
  const getStatusActions = (meeting) => {
    const { id, status } = meeting
    const isLoading = actionLoadingId === id
    const btns = []

    if (status === 'draft') {
  btns.push(
    <Button key="schedule" size="sm" variant="secondary"
      icon={<Send size={13} />}
      loading={isLoading}
      onClick={() => setConfirm({
        id,
        action: 'schedule',
        message: 'Schedule this meeting? Its status will change to Scheduled.',
        variant: 'primary'
      })}>
      Schedule
    </Button>
  )
}

    if (status === 'scheduled') {
      btns.push(
        <Button key="activate" size="sm" variant="success" icon={<PlayCircle size={13} />} loading={isLoading}
          onClick={() => handleStatusAction(id, 'activate')}>
          Start
        </Button>,

        <Button key="cancel" size="sm" variant="danger" icon={<XCircle size={13} />} loading={isLoading}
          onClick={() => setConfirm({
            id,
            action: 'cancel',
            message: 'Cancel this scheduled meeting? This cannot be undone.',
            variant: 'danger'
          })}>
          Cancel
        </Button>
      )
    }

    if (status === 'active') {
      btns.push(
        <Button key="end" size="sm" icon={<CheckCircle size={13} />} loading={isLoading}
          style={{ background: 'var(--success)', color: '#fff', border: 'none' }}
          onClick={() => setConfirm({
            id,
            action: 'end',
            message: 'End this meeting? It will be marked as completed.',
            variant: 'primary'
          })}>
          End Meeting
        </Button>
      )
    }

    return btns
  }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800 }}>Meetings</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{meetings.length} total meetings</p>
          </div>

          <Button icon={<Plus size={15} />} onClick={() => setShowCreateModal(true)}>
            New Meeting
          </Button>
        </div>

        {meetings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            No meetings yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {meetings.map(m => {
  const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.draft
  return (
    <div key={m.id} style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Top row: status badge + title + date */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.04em', padding: '3px 8px', borderRadius: '20px',
          background: `${cfg.color}18`, color: cfg.color,
          border: `1px solid ${cfg.color}30`, whiteSpace: 'nowrap', flexShrink: 0,
          marginTop: '2px',
        }}>
          {cfg.label}
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '15px', marginBottom: '3px' }}>
            {m.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            📅 {formatDateTime(m.scheduled_at)}
            {m.location && <span style={{ marginLeft: '6px' }}>📍 {m.location}</span>}
          </div>
        </div>
      </div>

      {/* Bottom row: all action buttons */}
      <div style={{
        display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center',
        paddingTop: '4px', borderTop: '1px solid var(--border)',
      }}>
        {/* Status actions */}
        {getStatusActions(m)}

        {/* Always-visible buttons */}
        <Button
          size="sm" variant="secondary" icon={<Settings size={13} />}
          onClick={() => navigate(`/admin/sessions/${m.id}`)}>
          Sessions
        </Button>
        <Button
          size="sm" variant="ghost" icon={<BarChart2 size={13} />}
          onClick={() => navigate(`/admin/results/${m.id}`)}>
          Results
        </Button>

        {/* Delete — only for non-active meetings */}
        {['draft', 'cancelled', 'completed'].includes(m.status) && (
          <Button
            size="sm" variant="danger" icon={<Trash2 size={13} />}
            onClick={() => setConfirm({
              id: m.id, action: 'delete',
              message: 'Permanently delete this meeting?', variant: 'danger'
            })}
          />
        )}
      </div>
    </div>
  )
})}
          </div>
        )}
      </main>

      {/* CREATE MODAL */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="New Meeting">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <Input label="Title" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />

          <Input label="Description" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

          <Input label="Date & Time" type="datetime-local" value={form.scheduled_at}
            onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))} />

          <Input label="Location" value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />

          {/* ✅ GEOFENCING UI */}
          <label style={{ display: 'flex', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.geofence_enabled}
              onChange={e => setForm(f => ({ ...f, geofence_enabled: e.target.checked }))}
            />
            Enable Geofencing
          </label>

          {form.geofence_enabled && (
            <>
              <Input label="Latitude" value={form.geofence_lat}
                onChange={e => setForm(f => ({ ...f, geofence_lat: e.target.value }))} />

              <Input label="Longitude" value={form.geofence_lng}
                onChange={e => setForm(f => ({ ...f, geofence_lng: e.target.value }))} />

              <Input label="Radius (meters)" type="number"
                value={form.geofence_radius_meters}
                onChange={e => setForm(f => ({
                  ...f,
                  geofence_radius_meters: parseInt(e.target.value) || 100
                }))} />

              <button
                type="button"
                onClick={() => {
                  navigator.geolocation?.getCurrentPosition(pos => {
                    setForm(f => ({
                      ...f,
                      geofence_lat: pos.coords.latitude.toFixed(7),
                      geofence_lng: pos.coords.longitude.toFixed(7),
                    }))
                    toast.success('Location captured')
                  })
                }}
              >
                📍 Use My Location
              </button>
            </>
          )}

          <Button onClick={handleCreate} loading={saving}>
            Create
          </Button>

        </div>
      </Modal>
      <Modal isOpen={!!confirm} onClose={() => setConfirm(null)} title="Confirm" width="400px">
  {confirm && (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
        {confirm.message}
      </p>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Button variant="secondary" onClick={() => setConfirm(null)} fullWidth>
          Cancel
        </Button>

        <Button
          variant={confirm.variant === 'danger' ? 'danger' : 'primary'}
          loading={actionLoadingId === confirm.id}
          onClick={() =>
            confirm.action === 'delete'
              ? handleDelete(confirm.id)
              : handleStatusAction(confirm.id, confirm.action)
          }
          fullWidth
        >
          Confirm
        </Button>
      </div>
    </div>
  )}
</Modal>
    </div>
  )
}
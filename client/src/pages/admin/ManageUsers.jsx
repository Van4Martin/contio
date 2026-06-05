import { useEffect, useState } from 'react'
import { Shield, User, Search, ChevronDown } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Loader from '../../components/common/Loader'
import { adminService } from '../../services/adminService'
import { useAuth } from '../../hooks/useAuth'
import { formatDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

export default function ManageUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    adminService.getAllUsers()
      .then(data => { setUsers(data); setFiltered(data) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = users
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(u =>
        u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      )
    }
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter)
    }
    setFiltered(result)
  }, [search, roleFilter, users])

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser?.id) {
      toast.error("You can't change your own role.")
      return
    }
    setUpdatingId(userId)
    try {
      const updated = await adminService.updateUserRole(userId, newRole)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: updated.role } : u))
      toast.success(`Role updated to ${newRole}.`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const adminCount = users.filter(u => u.role === 'admin').length
  const memberCount = users.filter(u => u.role === 'member').length

  if (loading) return <><Navbar /><Loader /></>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>
            Users
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Manage member accounts and role assignments.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {[
            { label: 'Total Users', value: users.length, color: 'var(--accent)', bg: 'var(--accent-dim)' },
            { label: 'Admins', value: adminCount, color: 'var(--warning)', bg: 'var(--warning-dim)' },
            { label: 'Members', value: memberCount, color: 'var(--success)', bg: 'var(--success-dim)' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '20px',
              display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              style={{
                width: '100%', padding: '10px 14px 10px 38px',
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                fontSize: '14px', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
              fontSize: '14px', outline: 'none', cursor: 'pointer', minWidth: '130px',
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
        </div>

        {/* Users table */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr auto auto',
            padding: '12px 20px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            fontSize: '12px', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500,
          }}>
            <span>User</span>
            <span>Email</span>
            <span style={{ textAlign: 'center' }}>Joined</span>
            <span style={{ textAlign: 'center' }}>Role</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No users match your search.
            </div>
          ) : (
            filtered.map((u, i) => {
              const isSelf = u.id === currentUser?.id
              const isUpdating = updatingId === u.id

              return (
                <div
                  key={u.id}
                  className="fade-in"
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr auto auto',
                    alignItems: 'center',
                    padding: '14px 20px',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.15s',
                    animationDelay: `${i * 0.03}s`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Name + avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: u.role === 'admin' ? 'rgba(245,158,11,0.15)' : 'var(--bg-hover)',
                      border: `1px solid ${u.role === 'admin' ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: u.role === 'admin' ? 'var(--warning)' : 'var(--text-muted)',
                      fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-display)',
                      flexShrink: 0,
                    }}>
                      {u.full_name ? u.full_name.charAt(0).toUpperCase() : <User size={14} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {u.full_name || '—'}
                        {isSelf && (
                          <span style={{ fontSize: '11px', background: 'var(--accent-dim)', color: 'var(--accent)', padding: '1px 7px', borderRadius: '10px' }}>
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {u.email}
                  </div>

                  {/* Joined */}
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', minWidth: '90px' }}>
                    {formatDate(u.created_at)}
                  </div>

                  {/* Role selector */}
                  <div style={{ minWidth: '130px', textAlign: 'right' }}>
                    {isSelf ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '5px 12px',
                        background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
                        borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                        color: 'var(--warning)',
                      }}>
                        <Shield size={11} /> Admin
                      </span>
                    ) : (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <select
                          value={u.role}
                          onChange={e => handleRoleChange(u.id, e.target.value)}
                          disabled={isUpdating}
                          style={{
                            appearance: 'none',
                            padding: '5px 28px 5px 12px',
                            background: u.role === 'admin' ? 'rgba(245,158,11,0.12)' : 'var(--bg-elevated)',
                            border: `1px solid ${u.role === 'admin' ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
                            borderRadius: '20px',
                            color: u.role === 'admin' ? 'var(--warning)' : 'var(--text-secondary)',
                            fontSize: '12px', fontWeight: 600,
                            cursor: isUpdating ? 'wait' : 'pointer',
                            outline: 'none',
                            transition: 'all 0.2s',
                            opacity: isUpdating ? 0.6 : 1,
                          }}
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                        <ChevronDown size={12} style={{
                          position: 'absolute', right: '8px', top: '50%',
                          transform: 'translateY(-50%)', pointerEvents: 'none',
                          color: u.role === 'admin' ? 'var(--warning)' : 'var(--text-muted)',
                        }} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
          Showing {filtered.length} of {users.length} Capitulars
        </div>
      </main>
    </div>
  )
}
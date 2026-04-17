import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Settings, LayoutDashboard, Shield } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header style={{
      height: '60px',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'var(--accent)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>M</span>
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', color: 'var(--text-primary)' }}>
          MeetGov
        </span>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <NavLink to="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" active={location.pathname === '/dashboard'} />
        {isAdmin && (
          <NavLink to="/admin" icon={<Shield size={15} />} label="Admin" active={location.pathname.startsWith('/admin')} />
        )}
        <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px' }} />
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {user?.user_metadata?.full_name || user?.email}
        </span>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 12px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginLeft: '8px',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          <LogOut size={14} />
          Logout
        </button>
      </nav>
    </header>
  )
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '7px 12px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '13px', fontWeight: 500,
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        background: active ? 'var(--accent-dim)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.2s',
      }}
    >
      {icon}{label}
    </Link>
  )
}
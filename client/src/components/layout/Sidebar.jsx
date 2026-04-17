import { NavLink as RouterNavLink } from 'react-router-dom'

export default function Sidebar({ links = [] }) {
  return (
    <aside style={{
      width: '220px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      padding: '24px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      minHeight: 'calc(100vh - 60px)',
    }}>
      {links.map(({ to, icon, label }) => (
        <RouterNavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px', fontWeight: 500,
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            background: isActive ? 'var(--accent-dim)' : 'transparent',
            textDecoration: 'none',
            transition: 'all 0.2s',
            border: isActive ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
          })}
        >
          {icon}
          {label}
        </RouterNavLink>
      ))}
    </aside>
  )
}
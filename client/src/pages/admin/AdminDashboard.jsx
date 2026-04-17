import { Link } from 'react-router-dom'
import { CalendarPlus, Shield, BarChart2, Users } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'

const cards = [
  { to: '/admin/meetings', icon: <CalendarPlus size={28} />, title: 'Manage Meetings', desc: 'Create, edit and control meetings', color: 'var(--accent)' },
  { to: '#', icon: <Users size={28} />, title: 'Users', desc: 'View registered members', color: 'var(--success)' },
  { to: '#', icon: <BarChart2 size={28} />, title: 'Reports', desc: 'View aggregate analytics', color: 'var(--warning)' },
  { to: '#', icon: <Shield size={28} />, title: 'Security', desc: 'Manage roles and permissions', color: 'var(--danger)' },
]

export default function AdminDashboard() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }} className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Shield size={22} style={{ color: 'var(--accent)' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800 }}>Admin Panel</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '36px' }}>Manage all aspects of your meeting governance system.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {cards.map((card, i) => (
            <Link
              key={card.title}
              to={card.to}
              className="fade-in"
              style={{
                display: 'flex', flexDirection: 'column', gap: '16px',
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '24px',
                textDecoration: 'none', transition: 'all 0.2s',
                animationDelay: `${i * 0.07}s`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: `${card.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                {card.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{card.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{card.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
import { CheckCircle, Clock } from 'lucide-react'
import Button from '../common/Button'

export default function CheckInCard({ section, isCheckedIn, onCheckIn, loading }) {
  return (
    <div style={{
      background: isCheckedIn ? 'var(--success-dim)' : 'var(--bg-elevated)',
      border: `1px solid ${isCheckedIn ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px', height: '42px',
          borderRadius: 'var(--radius-md)',
          background: isCheckedIn ? 'rgba(34,197,94,0.15)' : 'var(--bg-hover)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isCheckedIn ? 'var(--success)' : 'var(--text-muted)',
        }}>
          {isCheckedIn ? <CheckCircle size={20} /> : <Clock size={20} />}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '15px' }}>
            {section.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {isCheckedIn ? 'Attendance recorded' : 'Not yet checked in'}
          </div>
        </div>
      </div>
      {!isCheckedIn && (
        <Button onClick={onCheckIn} loading={loading} size="sm">
          Check In
        </Button>
      )}
    </div>
  )
}
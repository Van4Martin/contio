import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react'

const options = [
  { value: 'yes', label: 'Yes', icon: <ThumbsUp size={16} />, color: 'var(--success)', dim: 'var(--success-dim)', border: 'rgba(34,197,94,0.3)' },
  { value: 'no', label: 'No', icon: <ThumbsDown size={16} />, color: 'var(--danger)', dim: 'var(--danger-dim)', border: 'rgba(239,68,68,0.3)' },
  { value: 'abstain', label: 'Abstain', icon: <Minus size={16} />, color: 'var(--text-secondary)', dim: 'var(--bg-hover)', border: 'var(--border)' },
]

export default function MotionVoteCard({ motion, selectedVote, onVote }) {
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
    }}>
      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '8px' }}>{motion.title}</h4>
      {motion.description && (
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
          {motion.description}
        </p>
      )}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {options.map(opt => {
          const isSelected = selectedVote === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onVote(opt.value)}
              style={{
                flex: 1, minWidth: '80px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '10px 14px',
                background: isSelected ? opt.dim : 'var(--bg-surface)',
                border: `1px solid ${isSelected ? opt.border : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                color: isSelected ? opt.color : 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '14px', fontWeight: isSelected ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              {opt.icon} {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
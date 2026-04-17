import { Check } from 'lucide-react'

export default function CandidateSelect({ candidates, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {candidates.map(candidate => {
        const isSelected = selected === candidate.id
        return (
          <button
            key={candidate.id}
            onClick={() => onSelect(candidate.id)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px',
              background: isSelected ? 'var(--accent-dim)' : 'var(--bg-elevated)',
              border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: isSelected ? 600 : 400,
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
          >
            <span>{candidate.name}</span>
            {isSelected && <Check size={16} />}
          </button>
        )
      })}
    </div>
  )
}
// import { ThumbsUp, ThumbsDown, Minus, NotebookPen } from 'lucide-react'

// const options = [
//   { value: 'yes', label: 'Placet', icon: <ThumbsUp size={16} />, color: 'var(--success)', dim: 'var(--success-dim)', border: 'rgba(34,197,94,0.3)' },
//   { value: 'juxta modum', label: 'Placet Juxta Modum', icon: <NotebookPen size={30} />, color: 'var(--success)', dim: 'var(--success-dim)', border: 'rgba(34,197,94,0.3)' },
//   { value: 'no', label: 'Non Placet', icon: <ThumbsDown size={16} />, color: 'var(--danger)', dim: 'var(--danger-dim)', border: 'rgba(239,68,68,0.3)' },
//   { value: 'abstain', label: 'Abstain', icon: <Minus size={16} />, color: 'var(--text-secondary)', dim: 'var(--bg-hover)', border: 'var(--border)' },
// ]

// export default function MotionVoteCard({ motion, selectedVote, onVote }) {
//   return (
//     <div style={{
//       background: 'var(--bg-elevated)',
//       border: '1px solid var(--border)',
//       borderRadius: 'var(--radius-lg)',
//       padding: '20px',
//     }}>
//       <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '8px' }}>{motion.title}</h4>
//       {motion.description && (
//         <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
//           {motion.description}
//         </p>
//       )}
//       <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
//         {options.map(opt => {
//           const isSelected = selectedVote === opt.value
//           return (
//             <button
//               key={opt.value}
//               onClick={() => onVote(opt.value)}
//               style={{
//                 flex: 1, minWidth: '80px',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
//                 padding: '10px 14px',
//                 background: isSelected ? opt.dim : 'var(--bg-surface)',
//                 border: `1px solid ${isSelected ? opt.border : 'var(--border)'}`,
//                 borderRadius: 'var(--radius-md)',
//                 color: isSelected ? opt.color : 'var(--text-secondary)',
//                 cursor: 'pointer',
//                 fontFamily: 'var(--font-body)',
//                 fontSize: '14px', fontWeight: isSelected ? 600 : 400,
//                 transition: 'all 0.2s',
//               }}
//             >
//               {opt.icon} {opt.label}
//             </button>
//           )
//         })}
//       </div>
//     </div>
//   )
// }



import { ThumbsUp, ThumbsDown, Minus, NotebookPen } from 'lucide-react'

const options = [
  { value: 'yes', label: 'Yes', icon: <ThumbsUp size={16} />, color: 'var(--success)', dim: 'var(--success-dim)', border: 'rgba(34,197,94,0.3)' },
  { value: 'juxta modum', label: 'Juxta Modum', icon: <NotebookPen size={16} />, color: 'var(--success)', dim: 'var(--success-dim)', border: 'rgba(34,197,94,0.3)' },
  { value: 'no', label: 'No', icon: <ThumbsDown size={16} />, color: 'var(--danger)', dim: 'var(--danger-dim)', border: 'rgba(239,68,68,0.3)' },
  { value: 'abstain', label: 'Abstain', icon: <Minus size={16} />, color: 'var(--text-secondary)', dim: 'var(--bg-hover)', border: 'var(--border)' },
]

export default function MotionVoteCard({ motion, selectedVote, comment, onVote, onCommentChange }) {
  const requiresComment = selectedVote === 'juxta modum'

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    }}>
      <div>
        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '6px' }}>
          {motion.title}
        </h4>
        {motion.description && (
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {motion.description}
          </p>
        )}
      </div>

      {/* Vote options */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {options.map(opt => {
          const isSelected = selectedVote === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onVote(opt.value)}
              style={{
                flex: 1, minWidth: '80px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '10px 12px',
                background: isSelected ? opt.dim : 'var(--bg-surface)',
                border: `1px solid ${isSelected ? opt.border : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                color: isSelected ? opt.color : 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '13px', fontWeight: isSelected ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              {opt.icon} {opt.label}
            </button>
          )
        })}
      </div>

      {/* Comment field — only appears for Placet Juxta Modum */}
      {requiresComment && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            fontSize: '12px', fontWeight: 600,
            color: 'var(--success)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <NotebookPen size={13} />
            Condition / Remark
            <span style={{ color: 'var(--danger)', marginLeft: '2px' }}>*</span>
          </label>
          <textarea
            value={comment || ''}
            onChange={e => onCommentChange?.(e.target.value)}
            placeholder="State your condition or remark for Juxta Modum..."
            rows={3}
            required
            style={{
              width: '100%',
              padding: '11px 14px',
              background: 'var(--bg-surface)',
              border: '1px solid rgba(34,197,94,0.4)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
              resize: 'vertical',
              outline: 'none',
              lineHeight: 1.5,
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--success)'}
            onBlur={e => e.target.style.borderColor = 'rgba(34,197,94,0.4)'}
          />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Required — explain the condition under which you approve this motion.
          </span>
        </div>
      )}
    </div>
  )
}
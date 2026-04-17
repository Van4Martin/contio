import { forwardRef } from 'react'

const Input = forwardRef(function Input({
  label,
  error,
  hint,
  icon,
  type = 'text',
  className = '',
  containerStyle = {},
  ...props
}, ref) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...containerStyle }}>
      {label && (
        <label style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
          }}>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={className}
          style={{
            width: '100%',
            padding: icon ? '11px 14px 11px 40px' : '11px 14px',
            background: 'var(--bg-surface)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = error ? 'var(--danger)' : 'var(--accent)'
            e.target.style.boxShadow = error
              ? '0 0 0 3px var(--danger-dim)'
              : '0 0 0 3px var(--accent-glow)'
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'
            e.target.style.boxShadow = 'none'
          }}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: '12px', color: 'var(--danger)' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  )
})

export default Input
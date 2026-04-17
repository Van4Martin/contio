export default function Loader({ fullScreen = false, size = 36, text = 'Loading...' }) {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: size, height: size,
        border: `3px solid var(--border)`,
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      {text && <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{text}</span>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'var(--bg-base)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {content}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
      {content}
    </div>
  )
}
import Input from '../common/Input'
import { PenLine } from 'lucide-react'

export default function ManualEntry({ value, onChange, placeholder = 'Enter a name...' }) {
  return (
    <div style={{
      padding: '16px',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        — Or enter manually
      </div>
      <Input
        icon={<PenLine size={15} />}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
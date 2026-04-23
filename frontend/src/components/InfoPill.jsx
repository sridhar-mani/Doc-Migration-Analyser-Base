export function InfoPill({ label, value }) {
  return (
    <div style={{
      background: 'var(--color-surface-3)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 14px',
    }}>
      <p style={{
        fontSize: 'var(--font-size-xs)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--color-text-dim)',
        fontWeight: 600,
      }}>{label}</p>
      <p style={{
        fontSize: 'var(--font-size-md)',
        fontWeight: 700,
        color: 'var(--color-text)',
        marginTop: 2,
      }}>{value}</p>
    </div>
  )
}

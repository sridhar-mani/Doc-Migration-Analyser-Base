export function Skeleton({ height = 20, width = '100%', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ height, width, ...style }}
    />
  )
}

export function TableSkeleton({ rows = 10 }) {
  return (
    <div className="doc-table-wrap">
      <table className="doc-table">
        <thead>
          <tr>
            {['Document', 'Type', 'Pages', 'Words', 'Headings', 'Readability', 'Score', 'Status'].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td><Skeleton height={14} width={180} /></td>
              <td><Skeleton height={20} width={48} /></td>
              <td><Skeleton height={14} width={32} /></td>
              <td><Skeleton height={14} width={56} /></td>
              <td><Skeleton height={14} width={32} /></td>
              <td><Skeleton height={14} width={32} /></td>
              <td><Skeleton height={6} width={80} /></td>
              <td><Skeleton height={22} width={80} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PanelSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--color-border-2)' }}>
          <Skeleton height={14} width={120} />
          <Skeleton height={22} width={80} />
        </div>
      ))}
    </div>
  )
}

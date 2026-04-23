export function StatCard({ label, value, accent }) {
  return (
    <div className={`stat-card${accent ? ' stat-card--accent' : ''}`}>
      <p className="stat-card__label">{label}</p>
      <p className={`stat-card__value${accent ? ' stat-card__value--accent' : ''}`}>{value}</p>
    </div>
  )
}

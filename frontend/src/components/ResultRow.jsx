export function ResultRow({ label, value, tone }) {
  const badgeClass =
    tone === 'emerald' ? 'badge badge--ready' :
    tone === 'amber'   ? 'badge badge--review' :
    tone === 'red'     ? 'badge badge--not-ready' :
                         'badge badge--docx'

  return (
    <div className="result-row">
      <p className="result-row__label">{label}</p>
      <span className={badgeClass}>{value}</span>
    </div>
  )
}

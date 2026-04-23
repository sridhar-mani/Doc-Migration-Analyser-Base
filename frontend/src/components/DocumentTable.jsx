import { useState } from 'react'

const SORT_KEYS = {
  name:            (d) => d.name,
  readiness_score: (d) => d.readiness_score,
  words:           (d) => d.words,
  pages:           (d) => d.pages,
  headings:        (d) => d.headings,
  readability:     (d) => d.readability_score,
}

function ReadinessBadge({ readiness }) {
  const cls =
    readiness === 'Ready'      ? 'badge badge--ready' :
    readiness === 'Needs Review' ? 'badge badge--review' :
                                    'badge badge--not-ready'
  return <span className={cls}>{readiness}</span>
}

function TypeBadge({ type }) {
  return (
    <span className={`badge badge--${type.toLowerCase()}`}>{type}</span>
  )
}

function ScoreBar({ score, readiness }) {
  const cls =
    readiness === 'Ready'       ? 'mini-progress__fill--ready' :
    readiness === 'Needs Review' ? 'mini-progress__fill--review' :
                                   'mini-progress__fill--not-ready'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="col-score"
        style={{ color: readiness === 'Ready' ? 'var(--color-ready)' : readiness === 'Needs Review' ? 'var(--color-review)' : 'var(--color-not-ready)', fontWeight: 700, fontSize: 'var(--font-size-md)', minWidth: 28 }}>
        {score}
      </span>
      <div className="mini-progress" style={{ width: 60 }}>
        <div className={`mini-progress__fill ${cls}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export function DocumentTable({ documents }) {
  const [sortKey, setSortKey] = useState('readiness_score')
  const [sortDir, setSortDir] = useState('desc')

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...documents].sort((a, b) => {
    const fn = SORT_KEYS[sortKey] || SORT_KEYS.readiness_score
    const va = fn(a), vb = fn(b)
    if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    return sortDir === 'asc' ? va - vb : vb - va
  })

  function thClass(key) {
    return `sortable${sortKey === key ? ` sort-${sortDir}` : ''}`
  }

  return (
    <div className="doc-table-wrap">
      <table className="doc-table">
        <thead>
          <tr>
            <th className={thClass('name')} onClick={() => handleSort('name')}>Document</th>
            <th>Type</th>
            <th className={thClass('pages')} onClick={() => handleSort('pages')}>Pages</th>
            <th className={thClass('words')} onClick={() => handleSort('words')}>Words</th>
            <th className={thClass('headings')} onClick={() => handleSort('headings')}>Headings</th>
            <th className={thClass('readability')} onClick={() => handleSort('readability')}>Readability</th>
            <th className={thClass('readiness_score')} onClick={() => handleSort('readiness_score')}>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((doc) => (
            <tr key={doc.name}>
              <td className="col-name">{doc.name}</td>
              <td><TypeBadge type={doc.file_type} /></td>
              <td>{doc.pages}</td>
              <td>{doc.words.toLocaleString()}</td>
              <td>{doc.headings}</td>
              <td>
                <span style={{ color: doc.readability_score >= 60 ? 'var(--color-ready)' : doc.readability_score >= 40 ? 'var(--color-review)' : 'var(--color-not-ready)' }}>
                  {doc.readability_score}
                </span>
              </td>
              <td style={{ minWidth: 110 }}>
                <ScoreBar score={doc.readiness_score} readiness={doc.readiness} />
              </td>
              <td><ReadinessBadge readiness={doc.readiness} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

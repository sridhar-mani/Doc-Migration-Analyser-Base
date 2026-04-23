export function AnalysisPanelSimple({ document }) {
  if (!document) return null;

  return (
    <aside className="h-full rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">AI Analysis & Insights</h3>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Migration readiness</dt>
          <dd className="font-medium text-slate-800">{document.migrationReadiness}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Content clarity</dt>
          <dd className="font-medium text-slate-800">{document.contentClarity}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Structural quality</dt>
          <dd className="font-medium text-slate-800">{document.structuralQuality}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Readability</dt>
          <dd className="font-medium text-slate-800">{document.readability}</dd>
        </div>
      </dl>

      {document.suggestions && document.suggestions.length > 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-slate-900">Improvement Suggestions</p>
          <ul className="space-y-1 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
            {document.suggestions.map((suggestion, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-emerald-600">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}

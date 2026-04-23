export function AnalysisPanelSimple({ document }) {
  if (!document) return null;

  return (
    <aside className="h-full rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">Latest Analysis</h3>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Content clarity</dt>
          <dd className="font-medium text-slate-800">{document.contentClarity}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Structural quality</dt>
          <dd className="font-medium text-slate-800">{document.structuralQuality}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Migration readiness</dt>
          <dd className="font-medium text-slate-800">{document.migrationReadiness}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Readability</dt>
          <dd className="font-medium text-slate-800">{document.readability}</dd>
        </div>
      </dl>

      {document.suggestion ? (
        <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Suggestion</p>
          <p className="mt-1">{document.suggestion}</p>
        </div>
      ) : null}
    </aside>
  );
}

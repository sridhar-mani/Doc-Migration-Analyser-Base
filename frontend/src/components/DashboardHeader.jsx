export function DashboardHeader({ avgScore }) {
  return (
    <header className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Document Analysis Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Migration 2026 Readiness Report</h1>
          <p className="mt-1 text-sm text-slate-600">Upload a file and get migration readiness instantly.</p>
        </div>
        <div className="min-w-28 rounded-md border border-slate-200 bg-slate-50 p-3 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Avg Readiness</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{avgScore}</p>
        </div>
      </div>
    </header>
  );
}

export function DashboardHeader({ avgScore }) {
  return (
    <header className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Document Analysis Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">Migration 2026 Readiness Report</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">Upload a document, extract structure, and get AI-backed migration guidance instantly.</p>
        </div>
        <div className="min-w-36 rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-indigo-50 p-4 text-right shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Avg Readiness</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">{avgScore}</p>
        </div>
      </div>
    </header>
  );
}

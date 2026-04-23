function statusClasses(status) {
  if (status === "Ready") return "bg-emerald-50 text-emerald-700";
  if (status === "Needs Review") return "bg-amber-50 text-amber-700";
  return "bg-rose-50 text-rose-700";
}

function formatDate(date) {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryPanel({ records, isLoading, error }) {
  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        Error loading history: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
        Loading history...
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
        No analysis history yet. Upload a document to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Uploaded</th>
              <th className="px-3 py-2">Document</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Pages</th>
              <th className="px-3 py-2">Words</th>
              <th className="px-3 py-2">Effort</th>
              <th className="px-3 py-2">Readability</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={`${record.id}-${record.createdAt}`} className="border-t border-slate-100">
                <td className="px-3 py-2 text-xs text-slate-600">{formatDate(record.createdAt)}</td>
                <td className="px-3 py-2 font-medium text-slate-900 truncate max-w-xs">{record.name}</td>
                <td className="px-3 py-2 text-slate-700">{record.fileType}</td>
                <td className="px-3 py-2 text-slate-700">{record.pages}</td>
                <td className="px-3 py-2 text-slate-700">{record.words.toLocaleString()}</td>
                <td className="px-3 py-2 text-slate-700">{record.effortScore.toFixed(1)}/10</td>
                <td className="px-3 py-2 text-slate-700">{record.readability}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClasses(record.readiness)}`}>
                    {record.readiness}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

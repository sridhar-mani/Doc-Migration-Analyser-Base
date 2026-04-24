function statusClasses(status) {
  if (status === "Ready") return "bg-emerald-50 text-emerald-700";
  if (status === "Needs Review") return "bg-amber-50 text-amber-700";
  return "bg-rose-50 text-rose-700";
}

export function DocumentTableSimple({ documents }) {
  if (!documents.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
        Upload a document to see dynamic results.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Document</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Pages</th>
              <th className="px-3 py-2">Words</th>
              <th className="px-3 py-2">Headings</th>
              <th className="px-3 py-2">Readability</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={`${doc.name}-${doc.words}`} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium text-slate-900">
                  <div className="max-w-xs truncate">{doc.name}</div>
                  <div className="max-w-xs truncate text-xs text-slate-500">{doc.filePath || ""}</div>
                </td>
                <td className="px-3 py-2 text-slate-700">{doc.fileType}</td>
                <td className="px-3 py-2 text-slate-700">{doc.pages}</td>
                <td className="px-3 py-2 text-slate-700">{doc.words.toLocaleString()}</td>
                <td className="px-3 py-2 text-slate-700">{doc.headings}</td>
                <td className="px-3 py-2 text-slate-700">{doc.readability}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClasses(doc.readiness)}`}>
                    {doc.readiness}
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

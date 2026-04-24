export function RawDocumentPanel({ document }) {
  if (!document) return null;

  const rows = [
    ["Filename", document.name],
    ["File path", document.filePath || "Unavailable"],
    ["Type", document.fileType],
    ["Pages", document.pages],
    ["Words", document.words.toLocaleString()],
    ["Paragraphs", document.paragraphs],
    ["Headings", document.headings],
    ["Avg words/paragraph", document.avgWordsPerParagraph],
    ["Migration Effort Score", `${document.effortScore}/10`],
  ];

  return (
    <section className="h-full rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">Raw Document Snapshot</h3>
      <p className="mt-1 text-sm text-slate-500">
        Extracted structural data from the source document.
      </p>

      <dl className="mt-3 space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
            <dt className="text-slate-500">{label}</dt>
            <dd className="text-right font-medium text-slate-800">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const cards = [
  { key: "total", label: "Documents" },
  { key: "ready", label: "Ready" },
  { key: "review", label: "Needs Review" },
  { key: "notReady", label: "Not Ready" },
];

export function SummaryCards({ summary }) {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((card) => (
        <div key={card.key} className="rounded-md border border-slate-200 bg-white p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{summary[card.key] ?? 0}</p>
        </div>
      ))}
    </section>
  );
}

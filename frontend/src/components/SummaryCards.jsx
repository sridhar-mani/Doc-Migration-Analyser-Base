const cards = [
  { key: "total", label: "Documents", tone: "from-slate-50 to-slate-100" },
  { key: "ready", label: "Ready", tone: "from-emerald-50 to-emerald-100" },
  { key: "review", label: "Needs Review", tone: "from-amber-50 to-amber-100" },
  { key: "notReady", label: "Not Ready", tone: "from-rose-50 to-rose-100" },
];

export function SummaryCards({ summary }) {
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.key} className={`rounded-2xl border border-slate-200 bg-gradient-to-br p-4 shadow-sm ${card.tone}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">{card.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{summary[card.key] ?? 0}</p>
        </div>
      ))}
    </section>
  );
}

import { InfoPill } from './InfoPill'

const toneClasses = {
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
}

export function SectionGroup({ title, description, count, tone, files }) {
  return (
    <section className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${toneClasses[tone]}`}
        >
          {count} file{count === 1 ? '' : 's'}
        </span>
      </div>

      <div className="mt-5 flex-1 space-y-4 overflow-y-auto pr-1">
        {files.map((file) => (
          <article key={file.name} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{file.type}</p>
                <h3 className="mt-1 font-semibold text-slate-900">{file.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{file.note}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {file.status}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
              <InfoPill label="Pages" value={file.pages} />
              <InfoPill label="Words" value={file.words} />
              <InfoPill label="Paragraphs" value={file.paragraphs} />
              <InfoPill label="Headings" value={file.headings} />
              <InfoPill label="Avg words/para" value={file.avgWordsPerParagraph} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
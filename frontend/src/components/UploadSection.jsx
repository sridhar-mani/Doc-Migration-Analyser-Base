import { useState } from "react";
import { Loader2 } from "lucide-react";

export function UploadSection({ isSubmitting, onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);

  async function handleAnalyze() {
    if (!selectedFile) return;
    await onSubmit(selectedFile);
    setSelectedFile(null);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Upload Document</h2>
          <p className="text-sm text-slate-600">Supported formats: PDF, DOCX</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="cursor-pointer rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            <span>Choose file</span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </label>
          <span className="max-w-full truncate text-sm text-slate-600 sm:max-w-52">
            {selectedFile?.name || "No file selected"}
          </span>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!selectedFile || isSubmitting}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400 sm:ml-auto"
          >
            <span className="inline-flex items-center gap-2">
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
              {isSubmitting ? "Analyzing..." : "Analyze"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

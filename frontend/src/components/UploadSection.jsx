import { useState } from "react";

export function UploadSection({ isSubmitting, onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);

  async function handleAnalyze() {
    if (!selectedFile) return;
    await onSubmit(selectedFile);
    setSelectedFile(null);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Upload Document</h2>
          <p className="text-sm text-slate-600">Supported formats: PDF, DOCX</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
            Choose file
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </label>
          <span className="max-w-52 truncate text-sm text-slate-600">
            {selectedFile?.name || "No file selected"}
          </span>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!selectedFile || isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>
    </section>
  );
}

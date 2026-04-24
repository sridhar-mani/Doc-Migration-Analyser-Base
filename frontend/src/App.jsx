import { AlertCircle } from "lucide-react";
import { useMemo, useEffect, useCallback, useState } from "react";
import { AnalysisPanelSimple } from "./components/AnalysisPanelSimple";
import { DashboardHeader } from "./components/DashboardHeader";
import { DocumentTableSimple } from "./components/DocumentTableSimple";
import { HistoryPanel } from "./components/HistoryPanel";
import { RawDocumentPanel } from "./components/RawDocumentPanel";
import { SummaryCards } from "./components/SummaryCards";
import { UploadSection } from "./components/UploadSection";
import { useDocumentAnalysis } from "./hooks/useDocumentAnalysis";
import { useHistory } from "./hooks/useHistory";
import { deleteRecord, recheckRecord } from "./lib/analysisApi";

function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

export default function App() {
  const { documents, isSubmitting, error, submitFile } = useDocumentAnalysis();
  const { records: historyRecords, isLoading: historyLoading, error: historyError, refresh: refreshHistory } = useHistory();
  const [historyActionError, setHistoryActionError] = useState("");
  const latestDocument = documents[0];

  const summary = useMemo(() => {
    const source = historyRecords.length > 0 ? historyRecords : documents;
    const total = source.length;
    const ready = source.filter((d) => d.readiness === "Ready").length;
    const review = source.filter((d) => d.readiness === "Needs Review").length;
    const notReady = source.filter((d) => d.readiness === "Not Ready").length;
    const avgScore = total
      ? Math.round(source.reduce((sum, d) => sum + d.readinessScore, 0) / total)
      : 0;
    return { total, ready, review, notReady, avgScore };
  }, [historyRecords, documents]);

  useEffect(() => {
    if (documents.length > 0 && refreshHistory) {
      refreshHistory();
    }
  }, [documents.length, refreshHistory]);

  const handleRecheck = useCallback(
    async (recordId) => {
      setHistoryActionError("");
      try {
        await recheckRecord(recordId);
        await refreshHistory();
      } catch (err) {
        setHistoryActionError(err?.message || "Failed to recheck record");
      }
    },
    [refreshHistory],
  );

  const handleDelete = useCallback(
    async (recordId) => {
      setHistoryActionError("");
      try {
        await deleteRecord(recordId);
        await refreshHistory();
      } catch (err) {
        setHistoryActionError(err?.message || "Failed to delete record");
      }
    },
    [refreshHistory],
  );

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 sm:py-7 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-200/25 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-screen-2xl space-y-6">
        <DashboardHeader avgScore={summary.avgScore} />

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="space-y-6 xl:col-span-2">
            <SummaryCards summary={summary} />
            <ErrorBanner message={error} />
            <ErrorBanner message={historyActionError} />
            <DocumentTableSimple documents={documents} />

            {latestDocument ? (
              <section className="grid gap-6 lg:grid-cols-2">
                <RawDocumentPanel document={latestDocument} />
                <AnalysisPanelSimple document={latestDocument} />
              </section>
            ) : null}
          </section>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:h-fit">
            <UploadSection isSubmitting={isSubmitting} onSubmit={submitFile} />
          </aside>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-5">
          <h2 className="mb-3 text-xl font-semibold text-slate-900">Analysis History</h2>
          <HistoryPanel
            records={historyRecords}
            isLoading={historyLoading}
            error={historyError}
            onRecheck={handleRecheck}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </main>
  );
}

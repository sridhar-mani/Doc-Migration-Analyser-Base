import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { AnalysisPanelSimple } from "./components/AnalysisPanelSimple";
import { DashboardHeader } from "./components/DashboardHeader";
import { DocumentTableSimple } from "./components/DocumentTableSimple";
import { HistoryPanel } from "./components/HistoryPanel";
import { RawDocumentPanel } from "./components/RawDocumentPanel";
import { SummaryCards } from "./components/SummaryCards";
import { UploadSection } from "./components/UploadSection";
import { useDocumentAnalysis } from "./hooks/useDocumentAnalysis";
import { useHistory } from "./hooks/useHistory";

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
  const { documents, summary, isSubmitting, error, submitFile } = useDocumentAnalysis();
  const { records: historyRecords, isLoading: historyLoading, error: historyError, refresh: refreshHistory } = useHistory();
  const latestDocument = documents[0];

  useEffect(() => {
    if (documents.length > 0 && refreshHistory) {
      refreshHistory();
    }
  }, [documents.length, refreshHistory]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-3 p-3">
      <DashboardHeader avgScore={summary.avgScore} />
      <SummaryCards summary={summary} />
      <UploadSection isSubmitting={isSubmitting} onSubmit={submitFile} />
      <ErrorBanner message={error} />

      <DocumentTableSimple documents={documents} />

      {latestDocument ? (
        <section className="grid gap-3 lg:grid-cols-2">
          <RawDocumentPanel document={latestDocument} />
          <AnalysisPanelSimple document={latestDocument} />
        </section>
      ) : null}

      <section className="border-t border-slate-200 pt-3">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Analysis History</h2>
        <HistoryPanel records={historyRecords} isLoading={historyLoading} error={historyError} />
      </section>
    </main>
  );
}

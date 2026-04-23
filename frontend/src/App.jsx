import { AlertCircle } from "lucide-react";
import { AnalysisPanelSimple } from "./components/AnalysisPanelSimple";
import { DashboardHeader } from "./components/DashboardHeader";
import { DocumentTableSimple } from "./components/DocumentTableSimple";
import { RawDocumentPanel } from "./components/RawDocumentPanel";
import { SummaryCards } from "./components/SummaryCards";
import { UploadSection } from "./components/UploadSection";
import { useDocumentAnalysis } from "./hooks/useDocumentAnalysis";

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
  const latestDocument = documents[0];

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
    </main>
  );
}

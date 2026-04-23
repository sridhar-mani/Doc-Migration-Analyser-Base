import { useMemo, useState } from "react";
import { analyzeDocument } from "../lib/analysisApi";

export function useDocumentAnalysis() {
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const summary = useMemo(() => {
    const total = documents.length;
    const ready = documents.filter((d) => d.readiness === "Ready").length;
    const review = documents.filter((d) => d.readiness === "Needs Review").length;
    const notReady = documents.filter((d) => d.readiness === "Not Ready").length;
    const avgScore = total
      ? Math.round(documents.reduce((sum, d) => sum + d.readinessScore, 0) / total)
      : 0;
    return { total, ready, review, notReady, avgScore };
  }, [documents]);

  async function submitFile(file) {
    if (!file) return;
    setIsSubmitting(true);
    setError("");

    try {
      const report = await analyzeDocument(file);
      setDocuments((prev) => [report, ...prev]);
    } catch (err) {
      setError(err?.message || "Analysis failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return { documents, summary, isSubmitting, error, submitFile };
}

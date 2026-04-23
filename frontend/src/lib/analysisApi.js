const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const ANALYZE_PATHS = ["/api/analyze"];

function mapReadabilityToScore(level) {
  const value = String(level || "").toLowerCase();
  if (value.includes("easy")) return 80;
  if (value.includes("medium") || value.includes("moderate")) return 60;
  return 40;
}

function mapReadinessToViewModel(readiness) {
  const value = String(readiness || "").toLowerCase();
  if (value.includes("ready") && !value.includes("not")) {
    return { label: "Ready", score: 85 };
  }
  if (value.includes("cleanup") || value.includes("review") || value.includes("minor")) {
    return { label: "Needs Review", score: 60 };
  }
  return { label: "Not Ready", score: 35 };
}

export function normalizeReport(report) {
  const metrics = report?.metrics || {};
  const ai = report?.ai_analysis || {};
  const readiness = mapReadinessToViewModel(ai.migration_readiness);
  const name = report?.filename || "Uploaded document";
  const ext = name.split(".").pop()?.toUpperCase();

  return {
    name,
    fileType: ext === "DOCX" ? "DOCX" : "PDF",
    pages: Number(metrics.total_pages || 0),
    words: Number(metrics.word_count || 0),
    paragraphs: Number(metrics.paragraph_count || 0),
    headings: Number(metrics.heading_count || 0),
    avgWordsPerParagraph: Number(metrics.avg_words_per_paragraph || 0),
    readability: ai.readability_level || "-",
    readabilityScore: mapReadabilityToScore(ai.readability_level),
    contentClarity: ai.content_clarity || "-",
    structuralQuality: ai.structural_quality || "-",
    migrationReadiness: ai.migration_readiness || "-",
    suggestion: ai.improvement_suggestions?.[0] || "",
    readiness: readiness.label,
    readinessScore: readiness.score,
  };
}

export async function analyzeDocument(file) {
  let lastError = null;

  for (const path of ANALYZE_PATHS) {
    try {
      const form = new FormData();
      form.append("file", file);

      const response = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      return normalizeReport(payload);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to analyze document");
}

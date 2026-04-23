import { useEffect, useState, useCallback } from "react";
import { fetchHistory } from "../lib/analysisApi";

export function useHistory() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchHistory();
      setRecords(data);
    } catch (err) {
      setError(err?.message || "Failed to load history");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, []);

  return { records, isLoading, error, refresh: loadHistory };
}

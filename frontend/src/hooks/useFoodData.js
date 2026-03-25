import { useEffect, useMemo, useState } from "react";
import { fetchAllData } from "../api/apiClient";

export function useFoodData() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        setError(null);
        const rows = await fetchAllData();
        if (cancelled) return;
        setData(Array.isArray(rows) ? rows : []);
        setStatus("success");
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Failed to fetch data");
        setStatus("error");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const meta = useMemo(() => {
    const states = new Set();
    const years = new Set();
    const categories = new Set();

    for (const row of data) {
      if (row?.state) states.add(row.state);
      if (Number.isInteger(row?.year)) years.add(row.year);
      if (row?.food_category) categories.add(row.food_category);
    }

    return {
      states: Array.from(states).sort((a, b) => a.localeCompare(b)),
      years: Array.from(years).sort((a, b) => a - b),
      categories: Array.from(categories).sort((a, b) => a.localeCompare(b)),
    };
  }, [data]);

  return { data, meta, status, error };
}


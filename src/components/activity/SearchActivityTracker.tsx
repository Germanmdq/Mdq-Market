"use client";

import { useEffect } from "react";
import { trackActivity } from "@/lib/activity";

export default function SearchActivityTracker({
  query,
  source,
}: {
  query: string;
  source: string;
}) {
  useEffect(() => {
    if (!query.trim()) return;
    trackActivity({
      event_type: "search",
      entity_type: "search",
      search_query: query,
      metadata: { source },
    });
  }, [query, source]);

  return null;
}

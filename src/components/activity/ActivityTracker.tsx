"use client";

import { useEffect } from "react";
import { trackActivity, type ActivityPayload } from "@/lib/activity";

export default function ActivityTracker({ payload }: { payload: ActivityPayload }) {
  useEffect(() => {
    trackActivity(payload);
  }, [payload]);

  return null;
}

"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/track";

export default function PageViewTracker() {
  useEffect(() => {
    trackEvent({ type: "page_view" });
  }, []);

  return null;
}

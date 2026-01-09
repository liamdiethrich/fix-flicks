"use client";

export type TrackPayload = {
  type:
    | "page_view"
    | "outbound_click"
    | "add_to_cart"
    | "plan_add_to_cart"
    | "helpful_yes"
    | "helpful_no"
    | "search"
    | "fitfinder_result"
    | "request_submitted";
  fixSlug?: string;
  planSlug?: string;
  asin?: string;
  query?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
};

const UTM_KEY = "ff_utm";

function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const stored = window.sessionStorage.getItem(UTM_KEY);
  if (stored) {
    return JSON.parse(stored) as Record<string, string>;
  }
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach((key) => {
    const value = params.get(key);
    if (value) utm[key] = value;
  });
  window.sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
  return utm;
}

export function trackEvent(payload: TrackPayload) {
  if (typeof window === "undefined") return;
  const utm = readUtm();
  const body = {
    ...payload,
    referrer: document.referrer || undefined,
    utmSource: utm.utm_source,
    utmMedium: utm.utm_medium,
    utmCampaign: utm.utm_campaign,
    utmContent: utm.utm_content,
  };
  const blob = new Blob([JSON.stringify(body)], { type: "application/json" });
  const endpoint = "/api/events";
  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, blob);
    return;
  }
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => undefined);
}

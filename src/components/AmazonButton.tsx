"use client";

import { trackEvent } from "@/lib/track";

type Props = {
  href: string;
  label: string;
  event: "add_to_cart" | "plan_add_to_cart";
  fixSlug?: string;
  planSlug?: string;
};

export default function AmazonButton({ href, label, event, fixSlug, planSlug }: Props) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
      onClick={() => {
        trackEvent({ type: event, fixSlug, planSlug });
      }}
    >
      {label}
    </a>
  );
}

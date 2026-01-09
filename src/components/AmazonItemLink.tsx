"use client";

import { trackEvent } from "@/lib/track";

export default function AmazonItemLink({ href, asin }: { href: string; asin: string }) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
      onClick={() => trackEvent({ type: "outbound_click", asin })}
    >
      View on Amazon
    </a>
  );
}

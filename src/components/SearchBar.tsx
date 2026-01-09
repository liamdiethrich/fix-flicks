"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { trackEvent } from "@/lib/track";

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  return (
    <form
      className="flex w-full flex-col gap-2 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        if (!query.trim()) return;
        trackEvent({ type: "search", query });
        router.push(`/fixes?q=${encodeURIComponent(query.trim())}`);
      }}
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search fixes: drawers, cables, shower..."
        className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
      >
        Search
      </button>
    </form>
  );
}

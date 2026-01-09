"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/track";

export default function HelpfulWidget({ fixSlug }: { fixSlug: string }) {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<null | "yes" | "no">(null);
  const [sent, setSent] = useState(false);

  async function submit(vote: "yes" | "no") {
    setStatus(vote);
    trackEvent({ type: vote === "yes" ? "helpful_yes" : "helpful_no", fixSlug });
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fixSlug, vote, note: note.trim() || undefined }),
    });
    setSent(true);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold">Was this fix helpful?</h3>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            status === "yes" ? "bg-emerald-600 text-white" : "border border-slate-300 text-slate-700"
          }`}
          onClick={() => submit("yes")}
        >
          👍 Yes
        </button>
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            status === "no" ? "bg-rose-600 text-white" : "border border-slate-300 text-slate-700"
          }`}
          onClick={() => submit("no")}
        >
          👎 No
        </button>
      </div>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Optional: what would make this better?"
        className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm"
        rows={3}
      />
      {sent && <p className="mt-2 text-xs text-slate-500">Thanks for the feedback!</p>}
    </div>
  );
}

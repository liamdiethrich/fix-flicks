"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/track";

const roomOptions = [
  "kitchen",
  "bathroom",
  "desk",
  "closet",
  "laundry",
  "living",
  "pets",
  "entryway",
  "other",
];

export default function RequestForm() {
  const [room, setRoom] = useState(roomOptions[0]);
  const [problem, setProblem] = useState("");
  const [constraints, setConstraints] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      room,
      problem,
      constraints: [...constraints, details].filter(Boolean).join("; ") || "none",
      email: email.trim() || undefined,
    };
    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    trackEvent({ type: "request_submitted", query: JSON.stringify(payload) });
    setSent(true);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-700">Room</label>
        <select
          value={room}
          onChange={(event) => setRoom(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"
        >
          {roomOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700">Describe the problem</label>
        <textarea
          value={problem}
          onChange={(event) => setProblem(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"
          rows={4}
          required
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700">Constraints</label>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
          {["renter-safe", "no-drill", "small-space"].map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={constraints.includes(option)}
                onChange={(event) => {
                  setConstraints((prev) =>
                    event.target.checked ? [...prev, option] : prev.filter((item) => item !== option)
                  );
                }}
                className="h-4 w-4 rounded border-slate-300"
              />
              {option}
            </label>
          ))}
        </div>
        <input
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="Any extra details?"
          className="mt-3 w-full rounded-xl border border-slate-200 p-3 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700">Email (optional)</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"
        />
      </div>
      <button type="submit" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
        Send request
      </button>
      {sent && <p className="text-sm text-emerald-700">Thanks! We will follow up with a fix.</p>}
    </form>
  );
}

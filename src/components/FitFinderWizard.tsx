"use client";

import { useMemo, useState } from "react";
import type { Fix } from "@/lib/schemas";
import { trackEvent } from "@/lib/track";
import Link from "next/link";

const steps = ["Room", "Problem", "Constraints"];

export default function FitFinderWizard({ fixes }: { fixes: Fix[] }) {
  const rooms = Array.from(new Set(fixes.map((fix) => fix.room)));
  const tags = Array.from(new Set(fixes.flatMap((fix) => fix.tags))).slice(0, 12);
  const [step, setStep] = useState(0);
  const [room, setRoom] = useState<string>(rooms[0] ?? "other");
  const [tag, setTag] = useState<string>(tags[0] ?? "");
  const [renterSafe, setRenterSafe] = useState(false);
  const [noDrill, setNoDrill] = useState(false);

  const results = useMemo(() => {
    return fixes
      .filter((fix) => (room ? fix.room === room : true))
      .filter((fix) => (tag ? fix.tags.includes(tag) : true))
      .filter((fix) => (renterSafe ? fix.renterSafe : true))
      .filter((fix) => (noDrill ? fix.noDrill : true))
      .slice(0, 3);
  }, [fixes, room, tag, renterSafe, noDrill]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
        <span>Step {step + 1} of {steps.length}</span>
        <span>{steps[step]}</span>
      </div>
      {step === 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {rooms.map((roomOption) => (
            <button
              key={roomOption}
              type="button"
              className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                room === roomOption ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200"
              }`}
              onClick={() => setRoom(roomOption)}
            >
              {roomOption}
            </button>
          ))}
        </div>
      )}
      {step === 1 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {tags.map((tagOption) => (
            <button
              key={tagOption}
              type="button"
              className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                tag === tagOption ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200"
              }`}
              onClick={() => setTag(tagOption)}
            >
              {tagOption}
            </button>
          ))}
        </div>
      )}
      {step === 2 && (
        <div className="mt-6 space-y-3 text-sm text-slate-700">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={renterSafe}
              onChange={(event) => setRenterSafe(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Renter-safe only
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={noDrill}
              onChange={(event) => setNoDrill(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            No-drill only
          </label>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          className="text-sm font-semibold text-slate-500"
          onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
          disabled={step === 0}
        >
          Back
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setStep((prev) => Math.min(prev + 1, steps.length - 1))}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => {
              trackEvent({
                type: "fitfinder_result",
                query: JSON.stringify({ room, tag, renterSafe, noDrill }),
              });
            }}
          >
            See matches
          </button>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-base font-semibold text-slate-900">Top matches</h3>
        <div className="mt-3 grid gap-3">
          {results.map((fix) => (
            <Link
              key={fix.slug}
              href={`/fix/${fix.slug}`}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            >
              <div className="font-semibold text-slate-900">{fix.title}</div>
              <div className="text-slate-600">{fix.summary}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

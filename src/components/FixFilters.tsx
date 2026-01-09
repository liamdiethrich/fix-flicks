"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const rooms = [
  "",
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
const difficulties = ["", "easy", "medium", "hard"];

export default function FixFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  function updateParam(key: string, value: string) {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/fixes?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
      <label className="flex flex-col gap-2">
        Room
        <select
          className="rounded-lg border border-slate-200 px-3 py-2"
          value={searchParams.get("room") || ""}
          onChange={(event) => updateParam("room", event.target.value)}
        >
          {rooms.map((room) => (
            <option key={room || "all"} value={room}>
              {room || "All"}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2">
        Difficulty
        <select
          className="rounded-lg border border-slate-200 px-3 py-2"
          value={searchParams.get("difficulty") || ""}
          onChange={(event) => updateParam("difficulty", event.target.value)}
        >
          {difficulties.map((difficulty) => (
            <option key={difficulty || "all"} value={difficulty}>
              {difficulty || "All"}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300"
          checked={searchParams.get("renterSafe") === "true"}
          onChange={(event) => updateParam("renterSafe", event.target.checked ? "true" : "")}
        />
        Renter-safe
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300"
          checked={searchParams.get("noDrill") === "true"}
          onChange={(event) => updateParam("noDrill", event.target.checked ? "true" : "")}
        />
        No-drill
      </label>
      <label className="flex flex-col gap-2">
        Sort
        <select
          className="rounded-lg border border-slate-200 px-3 py-2"
          value={searchParams.get("sort") || "trending"}
          onChange={(event) => updateParam("sort", event.target.value)}
        >
          <option value="trending">Trending</option>
          <option value="newest">Newest</option>
        </select>
      </label>
    </div>
  );
}

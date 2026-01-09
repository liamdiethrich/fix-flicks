import Link from "next/link";
import type { Fix } from "@/lib/schemas";

export default function FixCard({ fix }: { fix: Fix }) {
  return (
    <Link
      href={`/fix/${fix.slug}`}
      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] uppercase tracking-wide">
          {fix.room}
        </span>
        <span>{fix.timeMinutes} min</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-slate-950">
        {fix.title}
      </h3>
      <p className="mt-2 text-sm text-slate-600">{fix.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        {fix.renterSafe && <span className="rounded-full bg-emerald-50 px-2 py-1">Renter-safe</span>}
        {fix.noDrill && <span className="rounded-full bg-sky-50 px-2 py-1">No-drill</span>}
        <span className="rounded-full bg-slate-100 px-2 py-1">{fix.difficulty}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
        {fix.tags.slice(0, 3).map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
    </Link>
  );
}

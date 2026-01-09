import FixCard from "@/components/FixCard";
import FixFilters from "@/components/FixFilters";
import SearchBar from "@/components/SearchBar";
import { filterFixes, getAllFixes, searchFixes } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import type { Fix } from "@/lib/schemas";

export default async function FixesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const room = typeof searchParams.room === "string" ? searchParams.room : undefined;
  const renterSafe = searchParams.renterSafe === "true" ? true : undefined;
  const noDrill = searchParams.noDrill === "true" ? true : undefined;
  const difficulty = typeof searchParams.difficulty === "string" ? searchParams.difficulty : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "trending";

  let fixes: Fix[] = query ? searchFixes(query) : filterFixes({ room, renterSafe, noDrill, difficulty });

  if (sort === "newest") {
    fixes = fixes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } else {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const events = await prisma.event.groupBy({
      by: ["fixSlug"],
      where: { fixSlug: { not: null }, createdAt: { gte: since } },
      _count: { fixSlug: true },
      orderBy: { _count: { fixSlug: "desc" } },
    });
    const scores = new Map(events.map((event) => [event.fixSlug, event._count.fixSlug]));
    fixes = fixes.sort((a, b) => (scores.get(b.slug) || 0) - (scores.get(a.slug) || 0));
  }

  const allFixes = getAllFixes();

  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-12 md:px-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Fix library</h1>
          <p className="text-sm text-slate-600">Browse vetted fixes, fit checks, and curated kits.</p>
        </div>
        <SearchBar initialQuery={query} />
        <FixFilters />
        <div className="grid gap-6 md:grid-cols-3">
          {fixes.map((fix) => (
            <FixCard key={fix.slug} fix={fix} />
          ))}
        </div>
        {!fixes.length && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            No fixes match your filters. Try clearing filters or explore our newest fixes.
          </div>
        )}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Not seeing your fix?</h2>
          <p className="mt-2 text-sm text-slate-600">Request a fix and we will prioritize it.</p>
          <div className="mt-4">
            <a href="/request" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
              Request a fix
            </a>
          </div>
        </div>
        <div className="text-xs text-slate-400">
          Total fixes available: {allFixes.length}
        </div>
      </div>
    </div>
  );
}

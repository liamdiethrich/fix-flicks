import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const topFixes = await prisma.event.groupBy({
    by: ["fixSlug"],
    where: { fixSlug: { not: null } },
    _count: { fixSlug: true },
    orderBy: { _count: { fixSlug: "desc" } },
    take: 10,
  });
  const topItems = await prisma.event.groupBy({
    by: ["asin"],
    where: { asin: { not: null } },
    _count: { asin: true },
    orderBy: { _count: { asin: "desc" } },
    take: 10,
  });

  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-12 md:px-6">
        <h1 className="text-3xl font-semibold text-slate-900">Analytics</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Top fixes</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {topFixes.map((item) => (
                <li key={item.fixSlug} className="flex items-center justify-between">
                  <span>{item.fixSlug}</span>
                  <span>{item._count.fixSlug}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Top items</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {topItems.map((item) => (
                <li key={item.asin} className="flex items-center justify-between">
                  <span>{item.asin}</span>
                  <span>{item._count.asin}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

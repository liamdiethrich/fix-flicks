import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import FixCard from "@/components/FixCard";
import DbInitBanner from "@/components/DbInitBanner";
import { getAllFixes } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { shouldShowDbInitBanner } from "@/lib/db";

export default async function Home() {
  const fixes = getAllFixes();
  const newest = fixes
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);
  const renterSafe = fixes.filter((fix) => fix.renterSafe).slice(0, 3);

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  let trendingEvents: Array<{ fixSlug: string | null }> = [];
  let dbNotInitialized = false;

  try {
    trendingEvents = await prisma.event.groupBy({
      by: ["fixSlug"],
      where: {
        fixSlug: { not: null },
        createdAt: { gte: since },
      },
      _count: { fixSlug: true },
      orderBy: { _count: { fixSlug: "desc" } },
      take: 3,
    });
  } catch (error) {
    if (shouldShowDbInitBanner(error)) {
      dbNotInitialized = true;
    } else {
      throw error;
    }
  }

  const trending = trendingEvents
    .map((event) => fixes.find((fix) => fix.slug === event.fixSlug))
    .filter((fix): fix is NonNullable<typeof fix> => Boolean(fix));

  return (
    <div className="bg-slate-50">
      <DbInitBanner show={dbNotInitialized} />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center md:gap-16 md:px-6">
        <div className="flex-1 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">FixFlicks</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Tiny videos. Real fixes.
          </h1>
          <p className="text-lg text-slate-600">
            Curated fix kits that help renters and busy households solve the small things fast—without guessing.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/fixes" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
              Browse Fixes
            </Link>
            <Link href="/fitfinder" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold">
              Take FitFinder
            </Link>
            <Link href="/plans" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold">
              View Plans
            </Link>
          </div>
        </div>
        <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Find a fix fast</h2>
          <p className="mt-2 text-sm text-slate-600">
            Search by room, problem, or tag. We will point you to the best kit.
          </p>
          <div className="mt-4">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-8 px-4 pb-16 md:px-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">Trending this week</h2>
          <p className="text-sm text-slate-600">Based on real fix kit clicks in the last 7 days.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {trending.length ? trending.map((fix) => <FixCard key={fix.slug} fix={fix} />) : fixes.slice(0, 3).map((fix) => <FixCard key={fix.slug} fix={fix} />)}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-8 px-4 pb-16 md:px-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">Newest fixes</h2>
          <p className="text-sm text-slate-600">Fresh fixes with updated kits and steps.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {newest.map((fix) => (
            <FixCard key={fix.slug} fix={fix} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-8 px-4 pb-16 md:px-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">Popular with renters</h2>
          <p className="text-sm text-slate-600">No-drill or renter-safe kits that move with you.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {renterSafe.map((fix) => (
            <FixCard key={fix.slug} fix={fix} />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-16 md:px-6">
          <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Pick a fix",
                body: "Browse vetted fixes with clear fit checks and simple steps.",
              },
              {
                title: "Open the kit",
                body: "Every fix includes a smart kit list you can add to Amazon in one click.",
              },
              {
                title: "Get it done",
                body: "Follow the steps, avoid common mistakes, and keep your space running smoothly.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

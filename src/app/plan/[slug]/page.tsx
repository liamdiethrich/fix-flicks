import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PlanChecklist from "@/components/PlanChecklist";
import AmazonButton from "@/components/AmazonButton";
import FixCard from "@/components/FixCard";
import { buildAddToCartUrl } from "@/lib/amazon";
import { getAllFixes, getPlanBySlug } from "@/lib/content";
import { getAssociateTagFromSearchParams } from "@/lib/associateTag";
import { getAvailableTiers, getTierLabel, parseTier, resolveKitOption } from "@/lib/fixKits";
import { getSiteUrl } from "@/lib/env";
import { buildQueryString } from "@/lib/url";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const plan = getPlanBySlug(params.slug);
  if (!plan) return {};
  const siteUrl = getSiteUrl();
  return {
    title: plan.seo.title || plan.title,
    description: plan.seo.description || plan.summary,
    alternates: { canonical: `${siteUrl}/plan/${plan.slug}` },
    openGraph: {
      title: plan.seo.title || plan.title,
      description: plan.seo.description || plan.summary,
      url: `${siteUrl}/plan/${plan.slug}`,
      images: plan.seo.ogImage ? [plan.seo.ogImage] : undefined,
    },
  };
}

export default function PlanDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const plan = getPlanBySlug(params.slug);
  if (!plan) notFound();
  const fixes = getAllFixes().filter((fix) => plan.fixSlugs.includes(fix.slug));
  const tag = getAssociateTagFromSearchParams(searchParams);
  const requestedTier = parseTier(typeof searchParams.tier === "string" ? searchParams.tier : undefined);
  const availableTiers = getAvailableTiers(fixes.flatMap((fix) => fix.kitOptions));
  const selectedTier =
    requestedTier && availableTiers.includes(requestedTier)
      ? requestedTier
      : availableTiers.includes("best")
        ? "best"
        : availableTiers[0] ?? "best";
  const combined = new Map<string, { asin: string; quantity: number }>();
  fixes.forEach((fix) => {
    const option = resolveKitOption(fix.kitOptions, selectedTier);
    option.items.forEach((item) => {
      const current = combined.get(item.asin) || { asin: item.asin, quantity: 0 };
      combined.set(item.asin, { asin: item.asin, quantity: current.quantity + item.quantity });
    });
  });
  const items = Array.from(combined.values());
  const cappedItems = items.slice(0, 20);
  const wasTruncated = items.length > 20;
  const cartUrl = buildAddToCartUrl(cappedItems, tag);

  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 md:px-6">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-3xl font-semibold text-slate-900">{plan.title}</h1>
          <p className="text-sm text-slate-600">{plan.summary}</p>
          <div className="flex flex-wrap gap-2">
            {availableTiers.map((tier) => {
              const isSelected = tier === selectedTier;
              return (
                <a
                  key={tier}
                  href={`/plan/${plan.slug}${buildQueryString(searchParams, { tier })}`}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    isSelected
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {getTierLabel(tier)}
                </a>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <AmazonButton
              href={cartUrl}
              label={`Add ${getTierLabel(selectedTier)} plan kit to Amazon cart`}
              event="plan_add_to_cart"
              planSlug={plan.slug}
            />
            <span className="text-xs text-slate-500">(affiliate link)</span>
          </div>
          <p className="text-xs text-slate-500">
            Tier preference applies across fixes; we fall back to the closest available kit when a tier is missing.
          </p>
          {wasTruncated && (
            <p className="text-xs text-amber-600">
              Plan includes more than 20 items; cart link is capped to the top 20.
            </p>
          )}
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">Checklist</h2>
            <div className="mt-4">
              <PlanChecklist items={plan.checklist} />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">Included fixes</h2>
            <div className="mt-4 grid gap-4">
              {fixes.map((fix) => (
                <FixCard key={fix.slug} fix={fix} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

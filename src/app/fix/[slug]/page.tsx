import { notFound } from "next/navigation";
import type { Metadata } from "next";
import FitCheckList from "@/components/FitCheckList";
import AmazonButton from "@/components/AmazonButton";
import AmazonItemLink from "@/components/AmazonItemLink";
import HelpfulWidget from "@/components/HelpfulWidget";
import FixCard from "@/components/FixCard";
import { buildAddToCartUrl, buildAmazonProductUrl } from "@/lib/amazon";
import { getAllFixes, getFixBySlug } from "@/lib/content";
import { getAmazonTag, getSiteUrl } from "@/lib/env";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const fix = getFixBySlug(params.slug);
  if (!fix) return {};
  const siteUrl = getSiteUrl();
  return {
    title: fix.seo.title || fix.title,
    description: fix.seo.description || fix.summary,
    alternates: { canonical: `${siteUrl}/fix/${fix.slug}` },
    openGraph: {
      title: fix.seo.title || fix.title,
      description: fix.seo.description || fix.summary,
      url: `${siteUrl}/fix/${fix.slug}`,
      images: fix.seo.ogImage ? [fix.seo.ogImage] : undefined,
    },
  };
}

export default function FixDetailPage({ params }: { params: { slug: string } }) {
  const fix = getFixBySlug(params.slug);
  if (!fix) notFound();
  const tag = getAmazonTag();
  const cartUrl = buildAddToCartUrl(
    fix.kit.map((item) => ({ asin: item.asin, quantity: item.quantity })),
    tag
  );
  const related = getAllFixes()
    .filter((item) => item.slug !== fix.slug)
    .filter((item) => item.room === fix.room || item.tags.some((tagItem) => fix.tags.includes(tagItem)))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: fix.title,
    description: fix.summary,
    totalTime: `PT${fix.timeMinutes}M`,
    step: fix.steps.map((step) => ({ "@type": "HowToStep", text: step })),
  };

  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <video
              className="w-full rounded-3xl border border-slate-200 bg-black"
              autoPlay
              muted
              loop
              playsInline
              poster={fix.heroVideo.poster}
            >
              <source src={fix.heroVideo.src} type="video/mp4" />
            </video>
            <p className="text-xs text-slate-500">
              AI-generated video for illustration; verify details on the product listing.
            </p>
          </div>
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-xs uppercase tracking-wide text-emerald-600">{fix.room}</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{fix.title}</h1>
              <p className="mt-3 text-sm text-slate-600">{fix.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-1">{fix.timeMinutes} min</span>
                <span className="rounded-full bg-slate-100 px-2 py-1">{fix.difficulty}</span>
                {fix.renterSafe && <span className="rounded-full bg-emerald-50 px-2 py-1">Renter-safe</span>}
                {fix.noDrill && <span className="rounded-full bg-sky-50 px-2 py-1">No-drill</span>}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <AmazonButton
                  href={cartUrl}
                  label="Add full kit to Amazon cart"
                  event="add_to_cart"
                  fixSlug={fix.slug}
                />
                <span className="text-xs text-slate-500">(affiliate link)</span>
                <a href="#kit" className="text-sm font-semibold text-slate-700">
                  Scroll to kit
                </a>
              </div>
            </div>
            <FitCheckList items={fix.fitCheck} />
          </div>
        </div>

        <section id="kit" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Kit essentials</h2>
            <div className="flex items-center gap-2">
              <AmazonButton
                href={cartUrl}
                label="Add kit to Amazon cart"
                event="add_to_cart"
                fixSlug={fix.slug}
              />
              <span className="text-xs text-slate-500">(affiliate link)</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {fix.kit.map((item) => (
              <div key={item.asin} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">{item.name}</h3>
                  <span className="text-xs text-slate-500">Qty {item.quantity}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.why}</p>
                {item.isPlaceholder && (
                  <p className="mt-2 text-xs text-amber-600">Placeholder ASIN—replace before launch.</p>
                )}
                <div className="mt-3">
                  <AmazonItemLink href={buildAmazonProductUrl(item.asin, tag)} asin={item.asin} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900">Steps</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
              {fix.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="space-y-4">
            {fix.mistakes.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Common mistakes</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {fix.mistakes.map((mistake) => (
                    <li key={mistake}>{mistake}</li>
                  ))}
                </ul>
              </div>
            )}
            {fix.faqs.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">FAQs</h3>
                <div className="mt-3 space-y-3 text-sm text-slate-600">
                  {fix.faqs.map((faq) => (
                    <div key={faq.q}>
                      <p className="font-semibold text-slate-800">{faq.q}</p>
                      <p>{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <HelpfulWidget fixSlug={fix.slug} />

        {related.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Related fixes</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <FixCard key={item.slug} fix={item} />
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-4 py-3 shadow-lg md:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Add full kit</span>
          <div className="flex items-center gap-2">
            <AmazonButton href={cartUrl} label="Amazon cart" event="add_to_cart" fixSlug={fix.slug} />
            <span className="text-[11px] text-slate-500">(affiliate link)</span>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}

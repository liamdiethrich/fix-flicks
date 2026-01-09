import CopyButton from "@/components/CopyButton";
import { requireAdmin } from "@/lib/adminAuth";
import { getAllFixes } from "@/lib/content";
import { getSiteUrl } from "@/lib/env";

function buildVariants(fix: { title: string; summary: string; room: string; tags: string[]; slug: string }) {
  const tagLine = fix.tags.slice(0, 2).join(", ");
  const titles = [
    `${fix.title} in ${fix.room}`,
    `Stop the ${tagLine} mess fast`,
    `A ${fix.room} fix you can finish today`,
  ];
  const descriptions = [
    `${fix.summary} Clear steps + kit essentials included.`,
    `Make ${fix.room} calmer with a quick fix and smart kit list.`,
    `Renter-friendly fix for ${fix.room} with a no-guess kit list.`,
  ];
  const base = getSiteUrl();
  const links = [1, 2, 3].map(
    (index) =>
      `${base}/fix/${fix.slug}?utm_source=pinterest&utm_medium=organic&utm_campaign=fix_${fix.slug}&utm_content=variant_${index}`
  );
  return { titles, descriptions, links };
}

export default async function PinPackPage() {
  await requireAdmin();
  const fixes = getAllFixes();

  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-12 md:px-6">
        <h1 className="text-3xl font-semibold text-slate-900">Pin Pack Generator</h1>
        <div className="space-y-6">
          {fixes.map((fix) => {
            const { titles, descriptions, links } = buildVariants(fix);
            return (
              <div key={fix.slug} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-slate-900">{fix.title}</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {titles.map((title) => (
                    <div key={title} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-800">{title}</p>
                      <div className="mt-2">
                        <CopyButton text={title} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {descriptions.map((desc) => (
                    <div key={desc} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="text-sm text-slate-700">{desc}</p>
                      <div className="mt-2">
                        <CopyButton text={desc} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {links.map((link) => (
                    <div key={link} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="text-xs text-slate-600 break-all">{link}</p>
                      <div className="mt-2">
                        <CopyButton text={link} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

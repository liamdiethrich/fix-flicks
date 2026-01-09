import type { MetadataRoute } from "next";
import { getAllFixes, getAllPlans } from "@/lib/content";
import { getSiteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const fixes = getAllFixes();
  const plans = getAllPlans();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
    { url: `${siteUrl}/fixes`, lastModified: new Date() },
    { url: `${siteUrl}/fitfinder`, lastModified: new Date() },
    { url: `${siteUrl}/plans`, lastModified: new Date() },
    { url: `${siteUrl}/request`, lastModified: new Date() },
    { url: `${siteUrl}/affiliate-disclosure`, lastModified: new Date() },
    { url: `${siteUrl}/privacy`, lastModified: new Date() },
    { url: `${siteUrl}/about`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
    ...fixes.map((fix) => ({
      url: `${siteUrl}/fix/${fix.slug}`,
      lastModified: new Date(fix.updatedAt),
    })),
    ...plans.map((plan) => ({
      url: `${siteUrl}/plan/${plan.slug}`,
      lastModified: new Date(plan.updatedAt),
    })),
  ];
}

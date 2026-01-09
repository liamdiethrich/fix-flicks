import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

const EventSchema = z.object({
  type: z.enum([
    "page_view",
    "outbound_click",
    "add_to_cart",
    "plan_add_to_cart",
    "helpful_yes",
    "helpful_no",
    "search",
    "fitfinder_result",
    "request_submitted",
  ]),
  fixSlug: z.string().optional(),
  planSlug: z.string().optional(),
  asin: z.string().optional(),
  query: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
});

export async function POST(request: Request) {
  const userAgent = request.headers.get("user-agent") || "unknown";
  if (!rateLimit(`events:${userAgent}`, 30, 0.5)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }
  const body = await request.json();
  const parsed = EventSchema.parse(body);
  await prisma.event.create({
    data: {
      type: parsed.type,
      fixSlug: parsed.fixSlug,
      planSlug: parsed.planSlug,
      asin: parsed.asin,
      query: parsed.query,
      referrer: parsed.referrer,
      utmSource: parsed.utmSource,
      utmMedium: parsed.utmMedium,
      utmCampaign: parsed.utmCampaign,
      utmContent: parsed.utmContent,
      userAgent,
    },
  });
  return NextResponse.json({ ok: true });
}

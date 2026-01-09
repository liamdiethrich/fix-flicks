import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const FeedbackSchema = z.object({
  fixSlug: z.string().min(1),
  vote: z.enum(["yes", "no"]),
  note: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = FeedbackSchema.parse(body);
  await prisma.feedback.create({
    data: {
      fixSlug: parsed.fixSlug,
      vote: parsed.vote,
      note: parsed.note,
    },
  });
  return NextResponse.json({ ok: true });
}

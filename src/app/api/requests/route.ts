import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

const RequestSchema = z.object({
  room: z.string().min(1),
  problem: z.string().min(1),
  constraints: z.string().min(1),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  const userAgent = request.headers.get("user-agent") || "unknown";
  if (!rateLimit(`requests:${userAgent}`, 10, 0.2)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }
  const body = await request.json();
  const parsed = RequestSchema.parse(body);
  await prisma.request.create({
    data: {
      room: parsed.room,
      problem: parsed.problem,
      constraints: parsed.constraints,
      email: parsed.email,
    },
  });
  return NextResponse.json({ ok: true });
}

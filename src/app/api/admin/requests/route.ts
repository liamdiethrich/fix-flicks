import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "planned", "published", "ignored"]),
});

export async function POST(request: Request) {
  await requireAdmin();
  const formData = await request.formData();
  const parsed = UpdateSchema.parse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  await prisma.request.update({
    where: { id: parsed.id },
    data: { status: parsed.status },
  });
  return NextResponse.redirect(new URL("/admin/requests", request.url));
}

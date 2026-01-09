import { NextResponse } from "next/server";
import { getAdminPassword } from "@/lib/env";
import { createAdminSession } from "@/lib/admin";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");
  if (password !== getAdminPassword()) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
  }
  const token = await createAdminSession();
  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set("ff_admin", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

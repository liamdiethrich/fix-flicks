import crypto from "node:crypto";
import { prisma } from "./prisma";
import { getAdminSessionSecret } from "./env";

export function generateAdminToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashAdminToken(token: string): string {
  const secret = getAdminSessionSecret();
  return crypto.createHash("sha256").update(token + secret).digest("hex");
}

export async function createAdminSession(): Promise<string> {
  const token = generateAdminToken();
  const tokenHash = hashAdminToken(token);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.adminSession.create({
    data: { tokenHash, expiresAt },
  });
  return token;
}

export async function verifyAdminSession(token: string | undefined) {
  if (!token) return null;
  const tokenHash = hashAdminToken(token);
  const session = await prisma.adminSession.findFirst({
    where: {
      tokenHash,
      expiresAt: { gt: new Date() },
    },
  });
  return session;
}

export async function clearExpiredSessions() {
  await prisma.adminSession.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}

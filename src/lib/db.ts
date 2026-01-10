import { Prisma } from "@prisma/client";

export function isMissingTableError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
    return true;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes("no such table") || message.includes("does not exist") || message.includes("missing table");
  }

  return false;
}

export function shouldShowDbInitBanner(error: unknown): boolean {
  return process.env.NODE_ENV === "development" && isMissingTableError(error);
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://fix-flicks.com";
}

export function getAmazonTag(): string {
  const tag = process.env.AMAZON_ASSOCIATE_TAG || "";
  if (!tag && process.env.NODE_ENV === "production") {
    throw new Error("AMAZON_ASSOCIATE_TAG is required in production.");
  }
  return tag;
}

export function getAdminPassword(): string {
  const value = process.env.ADMIN_PASSWORD || "";
  if (!value) {
    throw new Error("ADMIN_PASSWORD is required.");
  }
  return value;
}

export function getAdminSessionSecret(): string {
  const value = process.env.ADMIN_SESSION_SECRET || "";
  if (!value) {
    throw new Error("ADMIN_SESSION_SECRET is required.");
  }
  return value;
}

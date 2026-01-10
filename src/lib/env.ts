export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://fix-flicks.com";
}

export function getAmazonDefaultTag(): string {
  const tag = process.env.AMAZON_ASSOCIATE_TAG_DEFAULT || "";
  if (!tag && process.env.NODE_ENV === "production") {
    throw new Error("AMAZON_ASSOCIATE_TAG_DEFAULT is required in production.");
  }
  return tag;
}

export function getAmazonPinterestTag(): string {
  return process.env.AMAZON_ASSOCIATE_TAG_PINTEREST || "";
}

export function getAmazonOnelinkScriptSrc(): string | undefined {
  const src = process.env.NEXT_PUBLIC_AMAZON_ONELINK_SCRIPT_SRC || "";
  return src ? src : undefined;
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

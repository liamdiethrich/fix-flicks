import { getAmazonDefaultTag, getAmazonPinterestTag } from "./env";

type SearchParams = Record<string, string | string[] | undefined> | URLSearchParams;

function readParam(searchParams: SearchParams, key: string): string | undefined {
  if (searchParams instanceof URLSearchParams) {
    const value = searchParams.get(key);
    return value || undefined;
  }
  const raw = searchParams[key];
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

export function getAssociateTagFromSearchParams(searchParams: SearchParams): string {
  const defaultTag = getAmazonDefaultTag();
  const pinterestTag = getAmazonPinterestTag();
  const utmSource = readParam(searchParams, "utm_source");
  if (utmSource && utmSource.toLowerCase() === "pinterest" && pinterestTag) {
    return pinterestTag;
  }
  return defaultTag;
}

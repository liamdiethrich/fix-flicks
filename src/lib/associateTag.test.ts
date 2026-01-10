import { afterEach, describe, expect, it, vi } from "vitest";
import { getAssociateTagFromSearchParams } from "./associateTag";

describe("getAssociateTagFromSearchParams", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses pinterest tag when utm_source is pinterest", () => {
    vi.stubEnv("AMAZON_ASSOCIATE_TAG_DEFAULT", "default-20");
    vi.stubEnv("AMAZON_ASSOCIATE_TAG_PINTEREST", "pinterest-20");
    const tag = getAssociateTagFromSearchParams({ utm_source: "pinterest" });
    expect(tag).toBe("pinterest-20");
  });

  it("falls back to default tag for other sources", () => {
    vi.stubEnv("AMAZON_ASSOCIATE_TAG_DEFAULT", "default-20");
    vi.stubEnv("AMAZON_ASSOCIATE_TAG_PINTEREST", "pinterest-20");
    const tag = getAssociateTagFromSearchParams({ utm_source: "newsletter" });
    expect(tag).toBe("default-20");
  });
});

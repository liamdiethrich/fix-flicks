import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadFixesFrom } from "./content";

const validFix = {
  slug: "legacy-fix",
  title: "Legacy Fix",
  summary: "Legacy fix with kit field only.",
  room: "kitchen",
  tags: ["legacy", "kitchen"],
  renterSafe: true,
  noDrill: true,
  timeMinutes: 20,
  difficulty: "easy",
  heroVideo: {
    src: "/videos/legacy.mp4",
    poster: "/images/legacy.jpg",
    durationSeconds: 18,
  },
  fitCheck: [
    { question: "Do you need a quick fix?", recommendedIfYes: true },
    { question: "Are you renting?", recommendedIfYes: true },
    { question: "Is drilling off limits?", recommendedIfYes: true },
  ],
  kit: [
    { asin: "B000000000", name: "Legacy item 1", why: "Test kit", quantity: 1, isPlaceholder: true },
    { asin: "B000000001", name: "Legacy item 2", why: "Test kit", quantity: 1, isPlaceholder: true },
    { asin: "B000000002", name: "Legacy item 3", why: "Test kit", quantity: 1, isPlaceholder: true },
  ],
  toolsNeeded: ["Tape measure"],
  measurements: ["Measure cabinet width"],
  removalNotes: ["Use warm air to loosen adhesive"],
  steps: ["Step one", "Step two", "Step three"],
  mistakes: ["Skipping cleaning"],
  faqs: [{ q: "Is this safe?", a: "Yes, with care." }],
  updatedAt: "2025-01-05T15:30:00.000Z",
  seo: {
    title: "Legacy Fix",
    description: "Legacy fix description.",
    ogImage: "/images/legacy.jpg",
  },
};

const invalidFix = {
  slug: "bad-fix",
  title: "Bad Fix",
  summary: "missing fields",
};

describe("content loader", () => {
  it("rejects invalid fix content", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fixes-"));
    fs.writeFileSync(path.join(dir, "bad.json"), JSON.stringify(invalidFix));
    expect(() => loadFixesFrom(dir)).toThrow();
  });

  it("normalizes legacy kit into kitOptions", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fixes-"));
    fs.writeFileSync(path.join(dir, "good.json"), JSON.stringify(validFix));
    const fixes = loadFixesFrom(dir);
    expect(fixes[0].kitOptions).toHaveLength(1);
    expect(fixes[0].kitOptions[0].tier).toBe("best");
  });
});

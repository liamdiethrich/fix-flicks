import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadFixesFrom } from "./content";

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
});

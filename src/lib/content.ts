import fs from "node:fs";
import path from "node:path";
import { FixSchema, PlanSchema, type Fix, type Plan } from "./schemas";
import { getKitOptionsForFix } from "./fixKits";

const fixesDirectory = path.join(process.cwd(), "content", "fixes");
const plansDirectory = path.join(process.cwd(), "content", "plans");

export type FixWithKits = Fix & { kitOptions: ReturnType<typeof getKitOptionsForFix> };

let cachedFixes: FixWithKits[] | null = null;
let cachedPlans: Plan[] | null = null;

export function loadFixesFrom(directory: string): FixWithKits[] {
  const files = fs.readdirSync(directory).filter((file) => file.endsWith(".json"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(directory, file), "utf8");
    const parsed = FixSchema.parse(JSON.parse(raw));
    return {
      ...parsed,
      kitOptions: getKitOptionsForFix(parsed),
    };
  });
}

export function loadPlansFrom(directory: string, fixes: FixWithKits[]): Plan[] {
  const files = fs.readdirSync(directory).filter((file) => file.endsWith(".json"));
  const plans = files.map((file) => {
    const raw = fs.readFileSync(path.join(directory, file), "utf8");
    return PlanSchema.parse(JSON.parse(raw));
  });
  const fixSlugs = new Set(fixes.map((fix) => fix.slug));
  plans.forEach((plan) => {
    plan.fixSlugs.forEach((slug) => {
      if (!fixSlugs.has(slug)) {
        throw new Error(`Plan ${plan.slug} references unknown fix slug ${slug}`);
      }
    });
  });
  return plans;
}

function loadFixes(): FixWithKits[] {
  if (cachedFixes) {
    return cachedFixes;
  }
  const fixes = loadFixesFrom(fixesDirectory);
  cachedFixes = fixes;
  return fixes;
}

function loadPlans(): Plan[] {
  if (cachedPlans) {
    return cachedPlans;
  }
  const plans = loadPlansFrom(plansDirectory, loadFixes());
  cachedPlans = plans;
  return plans;
}

export function getAllFixes(): FixWithKits[] {
  return loadFixes().slice();
}

export function getFixBySlug(slug: string): FixWithKits | undefined {
  return loadFixes().find((fix) => fix.slug === slug);
}

export function getAllPlans(): Plan[] {
  return loadPlans().slice();
}

export function getPlanBySlug(slug: string): Plan | undefined {
  return loadPlans().find((plan) => plan.slug === slug);
}

export function searchFixes(query: string): FixWithKits[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }
  return loadFixes().filter((fix) => {
    const haystack = [fix.title, fix.summary, fix.tags.join(" "), fix.room].join(" ").toLowerCase();
    return haystack.includes(normalized);
  });
}

type FilterOptions = {
  room?: Fix["room"];
  renterSafe?: boolean;
  noDrill?: boolean;
  difficulty?: Fix["difficulty"];
  tag?: string;
};

export function filterFixes(filters: FilterOptions): FixWithKits[] {
  return loadFixes().filter((fix) => {
    if (filters.room && fix.room !== filters.room) return false;
    if (filters.renterSafe !== undefined && fix.renterSafe !== filters.renterSafe) return false;
    if (filters.noDrill !== undefined && fix.noDrill !== filters.noDrill) return false;
    if (filters.difficulty && fix.difficulty !== filters.difficulty) return false;
    if (filters.tag && !fix.tags.includes(filters.tag)) return false;
    return true;
  });
}

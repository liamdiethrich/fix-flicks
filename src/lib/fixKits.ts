import type { Fix, KitOption, KitTier } from "./schemas";

const kitTierOrder: KitTier[] = ["budget", "best", "premium"];

const kitTierLabels: Record<KitTier, string> = {
  budget: "Budget",
  best: "Best",
  premium: "Premium",
};

export function getKitOptionsForFix(fix: Fix): KitOption[] {
  if (fix.kitOptions && fix.kitOptions.length > 0) {
    return sortKitOptions(fix.kitOptions);
  }
  if (fix.kit && fix.kit.length > 0) {
    return [
      {
        tier: "best",
        label: "Best pick",
        items: fix.kit,
      },
    ];
  }
  return [];
}

export function sortKitOptions(options: KitOption[]): KitOption[] {
  return [...options].sort(
    (a, b) => kitTierOrder.indexOf(a.tier) - kitTierOrder.indexOf(b.tier)
  );
}

export function getDefaultKitTier(options: KitOption[]): KitTier {
  const best = options.find((option) => option.tier === "best");
  return best?.tier ?? options[0].tier;
}

export function getKitOptionForTier(options: KitOption[], tier: KitTier): KitOption | undefined {
  return options.find((option) => option.tier === tier);
}

export function resolveKitOption(options: KitOption[], preferredTier?: KitTier): KitOption {
  if (preferredTier) {
    const match = getKitOptionForTier(options, preferredTier);
    if (match) return match;
  }
  const fallbackTier = getDefaultKitTier(options);
  return getKitOptionForTier(options, fallbackTier) ?? options[0];
}

export function getTierLabel(tier: KitTier): string {
  return kitTierLabels[tier];
}

export function parseTier(value: string | undefined): KitTier | undefined {
  if (!value) return undefined;
  return kitTierOrder.includes(value as KitTier) ? (value as KitTier) : undefined;
}

export function getAvailableTiers(options: KitOption[]): KitTier[] {
  return kitTierOrder.filter((tier) => options.some((option) => option.tier === tier));
}

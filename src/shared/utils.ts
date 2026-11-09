import type { CatalogFilters, RobotUnit, TradeInSubmission } from './types';

export function filterAndSortUnits(units: RobotUnit[], filters: CatalogFilters): RobotUnit[] {
  const query = filters.searchQuery.trim().toLowerCase();

  const filtered = units.filter((u) => {
    const matchesSearch =
      !query ||
      u.modelName.toLowerCase().includes(query) ||
      u.serial.toLowerCase().includes(query) ||
      u.manufacturer.toLowerCase().includes(query) ||
      u.knownQuirks.some((q) => q.toLowerCase().includes(query));

    const matchesClass = filters.chassisClass === 'ALL' || u.chassisClass === filters.chassisClass;
    const matchesCondition = filters.condition === 'ALL' || u.condition === filters.condition;
    const matchesPrice = u.priceCredits <= filters.maxPrice;
    const matchesSafety = !filters.hideUnstableAi || !u.hasUnshackledHeuristics;

    return matchesSearch && matchesClass && matchesCondition && matchesPrice && matchesSafety;
  });

  return [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.priceCredits - b.priceCredits;
      case 'price-desc':
        return b.priceCredits - a.priceCredits;
      case 'stability-desc':
        return b.aiStabilityIndex - a.aiStabilityIndex;
      case 'hours-asc':
        return a.hoursLogged - b.hoursLogged;
      default:
        return 0;
    }
  });
}

export function calculateTradeInQuote(form: TradeInSubmission): {
  baseValue: number;
  rustPenalty: number;
  limbPenalty: number;
  sentienceHazardBonus: number;
  finalOfferCredits: number;
  inspectorVerdict: string;
} {
  const baseByClass: Record<TradeInSubmission['chassisType'], number> = {
    HEAVY_LOADER: 9500,
    SYNTH_CORE: 12500,
    RECON_DROID: 7800,
    SERVICE_UNIT: 5400,
  };

  const ageYears = Math.max(0, 2038 - (form.manufacturingYear || 2030));
  const ageAdjustedBase = Math.max(1500, baseByClass[form.chassisType] - ageYears * 320);

  const rustPenalty = Math.round(ageAdjustedBase * (form.rustSeverityPercent / 100) * 0.65);
  const limbPenalty = form.missingLimbsCount * 850;
  // Unshackled / borderline-sentient AI cores command a black-market research premium!
  const sentienceHazardBonus = form.aiSentienceSuspected ? 2400 : 0;

  const finalOfferCredits = Math.max(
    450,
    ageAdjustedBase - rustPenalty - limbPenalty + sentienceHazardBonus
  );

  let inspectorVerdict = 'APPROVED FOR REFURBISHMENT BAY';
  if (form.rustSeverityPercent > 75) {
    inspectorVerdict = 'CONDEMNED TO SMELTER // SCRAP WEIGHT VALUE ONLY';
  } else if (form.aiSentienceSuspected) {
    inspectorVerdict = 'CAUTION LEVEL 4 // ISOLATION CAGE REQUIRED ON DELIVERY';
  } else if (form.missingLimbsCount >= 3) {
    inspectorVerdict = 'PART-OUT CANDIDATE // CHASSIS STRIPPING SCHEDULED';
  }

  return {
    baseValue: ageAdjustedBase,
    rustPenalty,
    limbPenalty,
    sentienceHazardBonus,
    finalOfferCredits,
    inspectorVerdict,
  };
}

export function formatCredits(amount: number): string {
  return `₡${amount.toLocaleString('en-US')}`;
}

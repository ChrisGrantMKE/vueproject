export type FrameworkEngine = 'react' | 'vue' | 'split';

export type PageRoute = 'catalog' | 'workbench' | 'tradein';

export type ChassisClass = 'ALL' | 'HEAVY_LOADER' | 'RECON_DROID' | 'SYNTH_CORE' | 'SERVICE_UNIT';

export type ConditionGrade = 'ALL' | 'GRADE-A (REFURB)' | 'GRADE-B (FIELD SCORED)' | 'GRADE-C (SALVAGE)';

export interface RobotUnit {
  id: string;
  serial: string;
  modelName: string;
  manufacturer: string;
  year: number;
  chassisClass: Exclude<ChassisClass, 'ALL'>;
  condition: Exclude<ConditionGrade, 'ALL'>;
  priceCredits: number;
  originalMsrp: number;
  hoursLogged: number;
  aiStabilityIndex: number; // 0-100%
  hasUnshackledHeuristics: boolean;
  powerDrawKw: number;
  firmwareVersion: string;
  knownQuirks: string[];
  specs: {
    actuatorTorqueNm: number;
    neuralTflops: number;
    armorPlating: string;
    batteryCells: string;
  };
  svgType: 'loader' | 'hound' | 'core' | 'welder' | 'medic' | 'sentinel';
}

export interface CatalogFilters {
  searchQuery: string;
  chassisClass: ChassisClass;
  condition: ConditionGrade;
  maxPrice: number;
  hideUnstableAi: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'stability-desc' | 'hours-asc';
}

export interface DiagnosticState {
  selectedUnitId: string;
  overclockPercent: number;
  heuristicDampenerActive: boolean;
  selectedFirmware: string;
  stressTestRunning: boolean;
  telemetryLog: string[];
}

export interface TradeInSubmission {
  unitDesignation: string;
  chassisType: Exclude<ChassisClass, 'ALL'>;
  manufacturingYear: number;
  rustSeverityPercent: number;
  aiSentienceSuspected: boolean;
  missingLimbsCount: number;
  sellerCallsign: string;
  notes: string;
}

export interface CodeComparisonTopic {
  id: string;
  page: PageRoute | 'global';
  title: string;
  badge: string;
  mentalModelSummary: string;
  keyDifferences: {
    dimension: string;
    reactWay: string;
    vueWay: string;
  }[];
  reactCode: string;
  vueCode: string;
  architecturalTakeaway: string;
}

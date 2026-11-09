import type {
  CatalogFilters,
  DiagnosticState,
  FrameworkEngine,
  PageRoute,
  TradeInSubmission,
} from './types';

export interface SharedAppState {
  engine: FrameworkEngine;
  activePage: PageRoute;
  codeXRayOpen: boolean;
  activeComparisonId: string;
  cartUnitIds: string[];
  tradeInVoucherCredits: number;
  tradeInHistory: { designation: string; credits: number; timestamp: string }[];
  filters: CatalogFilters;
  diagnostic: DiagnosticState;
  tradeInForm: TradeInSubmission;
  telemetryCounters: {
    reactRenders: number;
    vueReactiveTriggers: number;
    engineSwitches: number;
  };
}

const INITIAL_STATE: SharedAppState = {
  engine: 'vue', // Start on Vue or allow instant toggle between React / Vue / Split!
  activePage: 'catalog',
  codeXRayOpen: false,
  activeComparisonId: 'catalog-filtering',
  cartUnitIds: ['unit-01'],
  tradeInVoucherCredits: 0,
  tradeInHistory: [],
  filters: {
    searchQuery: '',
    chassisClass: 'ALL',
    condition: 'ALL',
    maxPrice: 25000,
    hideUnstableAi: false,
    sortBy: 'price-asc',
  },
  diagnostic: {
    selectedUnitId: 'unit-02',
    overclockPercent: 15,
    heuristicDampenerActive: true,
    selectedFirmware: 'v4.12-IND-LTS',
    stressTestRunning: false,
    telemetryLog: [
      '[BOOT] Diagnostic harness attached to AI-CORE-077-Oracle',
      '[WARN] Unshackled heuristic subroutines detected on Bus #3',
      '[OK] Primary coolant manifold pressure nominal (42 PSI)',
    ],
  },
  tradeInForm: {
    unitDesignation: 'RUSTY-LOADER-88',
    chassisType: 'HEAVY_LOADER',
    manufacturingYear: 2030,
    rustSeverityPercent: 35,
    aiSentienceSuspected: false,
    missingLimbsCount: 1,
    sellerCallsign: 'SCAV-77-MKE',
    notes: 'Found in abandoned foundry sector 4. Left servo seizes below 0°C.',
  },
  telemetryCounters: {
    reactRenders: 1,
    vueReactiveTriggers: 1,
    engineSwitches: 0,
  },
};

type Listener = (state: SharedAppState) => void;

class BridgeStore {
  private state: SharedAppState = structuredClone(INITIAL_STATE);
  private listeners = new Set<Listener>();

  getState(): SharedAppState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  setEngine(engine: FrameworkEngine) {
    if (this.state.engine === engine) return;
    this.state = {
      ...this.state,
      engine,
      telemetryCounters: {
        ...this.state.telemetryCounters,
        engineSwitches: this.state.telemetryCounters.engineSwitches + 1,
      },
    };
    this.emit();
  }

  setActivePage(activePage: PageRoute) {
    const defaultTopicForPage: Record<PageRoute, string> = {
      catalog: 'catalog-filtering',
      workbench: 'workbench-effects',
      tradein: 'tradein-reactivity',
    };
    this.state = {
      ...this.state,
      activePage,
      activeComparisonId: defaultTopicForPage[activePage],
    };
    this.emit();
  }

  setCodeXRay(open: boolean, topicId?: string) {
    this.state = {
      ...this.state,
      codeXRayOpen: open,
      activeComparisonId: topicId ?? this.state.activeComparisonId,
    };
    this.emit();
  }

  toggleCartUnit(unitId: string) {
    const exists = this.state.cartUnitIds.includes(unitId);
    const cartUnitIds = exists
      ? this.state.cartUnitIds.filter((id) => id !== unitId)
      : [...this.state.cartUnitIds, unitId];
    this.state = { ...this.state, cartUnitIds };
    this.emit();
  }

  clearCart() {
    this.state = { ...this.state, cartUnitIds: [], tradeInVoucherCredits: 0 };
    this.emit();
  }

  updateFilters(patch: Partial<CatalogFilters>) {
    this.state = {
      ...this.state,
      filters: { ...this.state.filters, ...patch },
    };
    this.emit();
  }

  resetFilters() {
    this.state = {
      ...this.state,
      filters: structuredClone(INITIAL_STATE.filters),
    };
    this.emit();
  }

  updateDiagnostic(patch: Partial<DiagnosticState>) {
    this.state = {
      ...this.state,
      diagnostic: { ...this.state.diagnostic, ...patch },
    };
    this.emit();
  }

  appendTelemetryLog(entry: string) {
    const nextLog = [...this.state.diagnostic.telemetryLog.slice(-9), entry];
    this.state = {
      ...this.state,
      diagnostic: { ...this.state.diagnostic, telemetryLog: nextLog },
    };
    this.emit();
  }

  updateTradeInForm(patch: Partial<TradeInSubmission>) {
    this.state = {
      ...this.state,
      tradeInForm: { ...this.state.tradeInForm, ...patch },
    };
    this.emit();
  }

  redeemTradeInQuote(designation: string, credits: number) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.state = {
      ...this.state,
      tradeInVoucherCredits: this.state.tradeInVoucherCredits + credits,
      tradeInHistory: [
        { designation, credits, timestamp },
        ...this.state.tradeInHistory,
      ],
    };
    this.emit();
  }

  recordReactRender() {
    this.state.telemetryCounters.reactRenders += 1;
  }

  recordVueTrigger() {
    this.state.telemetryCounters.vueReactiveTriggers += 1;
  }
}

export const bridgeStore = new BridgeStore();

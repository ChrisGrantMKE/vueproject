import type { InjectionKey } from 'vue';
import type { SharedAppState } from '../shared/bridgeStore';
import type {
  CatalogFilters,
  DiagnosticState,
  PageRoute,
  RobotUnit,
  TradeInSubmission,
} from '../shared/types';

export interface VueStoreContext {
  state: SharedAppState;
  units: RobotUnit[];
  setActivePage: (page: PageRoute) => void;
  openCodeXRay: (topicId?: string) => void;
  closeCodeXRay: () => void;
  toggleCartUnit: (unitId: string) => void;
  clearCart: () => void;
  updateFilters: (patch: Partial<CatalogFilters>) => void;
  resetFilters: () => void;
  updateDiagnostic: (patch: Partial<DiagnosticState>) => void;
  appendTelemetryLog: (entry: string) => void;
  updateTradeInForm: (patch: Partial<TradeInSubmission>) => void;
  redeemTradeInQuote: (designation: string, credits: number) => void;
}

export const VUE_STORE_KEY: InjectionKey<VueStoreContext> = Symbol('VUE_STORE_KEY');

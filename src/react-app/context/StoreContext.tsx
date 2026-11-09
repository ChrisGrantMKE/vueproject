import React, { createContext, useContext, useEffect, useState } from 'react';
import { bridgeStore, type SharedAppState } from '../../shared/bridgeStore';
import { ROBOT_INVENTORY } from '../../shared/inventoryData';
import type {
  CatalogFilters,
  DiagnosticState,
  PageRoute,
  RobotUnit,
  TradeInSubmission,
} from '../../shared/types';

interface ReactStoreContextValue {
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

const StoreContext = createContext<ReactStoreContextValue | null>(null);

export const ReactStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SharedAppState>(() => bridgeStore.getState());

  useEffect(() => {
    return bridgeStore.subscribe((nextState) => {
      bridgeStore.recordReactRender();
      setState({ ...nextState });
    });
  }, []);

  const value: ReactStoreContextValue = {
    state,
    units: ROBOT_INVENTORY,
    setActivePage: (page) => bridgeStore.setActivePage(page),
    openCodeXRay: (topicId) => bridgeStore.setCodeXRay(true, topicId),
    closeCodeXRay: () => bridgeStore.setCodeXRay(false),
    toggleCartUnit: (unitId) => bridgeStore.toggleCartUnit(unitId),
    clearCart: () => bridgeStore.clearCart(),
    updateFilters: (patch) => bridgeStore.updateFilters(patch),
    resetFilters: () => bridgeStore.resetFilters(),
    updateDiagnostic: (patch) => bridgeStore.updateDiagnostic(patch),
    appendTelemetryLog: (entry) => bridgeStore.appendTelemetryLog(entry),
    updateTradeInForm: (patch) => bridgeStore.updateTradeInForm(patch),
    redeemTradeInQuote: (designation, credits) =>
      bridgeStore.redeemTradeInQuote(designation, credits),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useReactStore(): ReactStoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useReactStore must be used inside ReactStoreProvider');
  }
  return ctx;
}

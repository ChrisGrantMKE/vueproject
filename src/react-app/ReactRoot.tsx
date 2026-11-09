import React from 'react';
import { formatCredits } from '../shared/utils';
import { CodeXRayModal } from './components/CodeXRayModal';
import { ReactStoreProvider, useReactStore } from './context/StoreContext';
import { TradeInPage } from './pages/TradeInPage';
import { WorkbenchPage } from './pages/WorkbenchPage';
import { YardCatalogPage } from './pages/YardCatalogPage';

const ReactStorefrontInner: React.FC = () => {
  const { state, units, setActivePage, openCodeXRay } = useReactStore();

  const cartTotal = units
    .filter((u) => state.cartUnitIds.includes(u.id))
    .reduce((sum, u) => sum + u.priceCredits, 0);

  const netTotal = Math.max(0, cartTotal - state.tradeInVoucherCredits);

  return (
    <div className="app-shell">
      {/* Live Runtime Status Indicator */}
      <div className="runtime-status-strip is-react">
        <div>
          <strong style={{ color: '#7dd3fc' }}>⚛️ ACTIVE RUNTIME: REACT 19.0 (JSX + VIRTUAL DOM)</strong>{' '}
          <span style={{ color: 'var(--text-secondary)' }}>
            // Rendering via <code>createRoot().render(&lt;ReactRoot /&gt;)</code>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>
            REACT RENDER CYCLES: <strong style={{ color: '#7dd3fc' }}>{state.telemetryCounters.reactRenders}</strong>
          </span>
          <button
            type="button"
            className="btn-industrial"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}
            onClick={() => openCodeXRay('paradigm-overview')}
          >
            ? HOW REACT DIFFERS FROM VUE
          </button>
        </div>
      </div>

      {/* Industrial Storefront Header */}
      <header className="store-header">
        <div className="store-header-top">
          <div>
            <h1 className="brand-headline">
              <span>RUST &amp; SILICON</span>
              <span className="rust-accent">//</span>
              <span className="yellow-accent">SURPLUS AUTOMATA</span>
            </h1>
            <p className="brand-tagline">
              Certified Pre-Owned Heavy Robotics, Salvaged Actuators &amp; Decommissioned AI Cores •
              Sector 7G Foundry Yard
            </p>
          </div>

          <div className="cart-requisition-box">
            <div className="cart-requisition-title">
              REQUISITION BAY ({state.cartUnitIds.length} UNITS)
            </div>
            <div className="cart-requisition-values">
              <span style={{ color: 'var(--caution-bright)' }}>{formatCredits(netTotal)}</span>
              {state.tradeInVoucherCredits > 0 && (
                <span style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>
                  (VOUCHER: -{formatCredits(state.tradeInVoucherCredits)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Page Navigation with Concept Labels */}
        <nav className="store-nav-tabs">
          <button
            type="button"
            className={`nav-tab-btn ${state.activePage === 'catalog' ? 'active' : ''}`}
            onClick={() => setActivePage('catalog')}
          >
            <span>01. SURPLUS YARD CATALOG</span>
            <span className="nav-tab-concept">useState + useMemo + map()</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${state.activePage === 'workbench' ? 'active' : ''}`}
            onClick={() => setActivePage('workbench')}
          >
            <span>02. DIAGNOSTIC WORKBENCH</span>
            <span className="nav-tab-concept">useEffect + Cleanup + JSX Slots</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${state.activePage === 'tradein' ? 'active' : ''}`}
            onClick={() => setActivePage('tradein')}
          >
            <span>03. SALVAGE APPRAISAL &amp; CHECKOUT</span>
            <span className="nav-tab-concept">Immutable Form + Context</span>
          </button>
        </nav>
      </header>

      {/* Active Page Outlet */}
      <main>
        {state.activePage === 'catalog' && <YardCatalogPage />}
        {state.activePage === 'workbench' && <WorkbenchPage />}
        {state.activePage === 'tradein' && <TradeInPage />}
      </main>

      {/* Code X-Ray Modal */}
      <CodeXRayModal />
    </div>
  );
};

export const ReactRoot: React.FC = () => {
  return (
    <ReactStoreProvider>
      <ReactStorefrontInner />
    </ReactStoreProvider>
  );
};

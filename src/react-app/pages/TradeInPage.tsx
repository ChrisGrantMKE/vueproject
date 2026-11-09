import React, { useMemo } from 'react';
import type { ChassisClass } from '../../shared/types';
import { calculateTradeInQuote, formatCredits } from '../../shared/utils';
import { ChassisPanel } from '../components/ChassisPanel';
import { useReactStore } from '../context/StoreContext';

export const TradeInPage: React.FC = () => {
  const {
    state,
    units,
    updateTradeInForm,
    redeemTradeInQuote,
    toggleCartUnit,
    clearCart,
    openCodeXRay,
  } = useReactStore();

  const { tradeInForm, cartUnitIds, tradeInVoucherCredits, tradeInHistory } = state;

  // ⚛️ REACT PATTERN: Memoized appraisal calculation from immutable form object
  const quote = useMemo(() => {
    return calculateTradeInQuote(tradeInForm);
  }, [tradeInForm]);

  const cartUnits = useMemo(() => {
    return units.filter((u) => cartUnitIds.includes(u.id));
  }, [units, cartUnitIds]);

  const cartSubtotal = useMemo(() => {
    return cartUnits.reduce((sum, u) => sum + u.priceCredits, 0);
  }, [cartUnits]);

  const netPayable = Math.max(0, cartSubtotal - tradeInVoucherCredits);

  const handleRedeemVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeInForm.unitDesignation.trim()) return;
    redeemTradeInQuote(tradeInForm.unitDesignation, quote.finalOfferCredits);
  };

  return (
    <div>
      {/* Educational Concept Banner */}
      <div className="concept-spotlight-banner">
        <div className="concept-spotlight-text">
          <h3>⚛️ React View // Immutable Form Spreads &amp; Context API</h3>
          <p>
            In React, updating any field in a multi-field form requires creating a new object
            reference (<code>&#123; ...form, rustSeverityPercent: val &#125;</code>) because React
            detects state changes via <code>Object.is(oldRef, newRef)</code>. In Vue 3,{' '}
            <code>reactive(form)</code> wraps the object in a deep Proxy so{' '}
            <code>v-model=&quot;form.rustSeverityPercent&quot;</code> mutates the property directly!
          </p>
          <div className="concept-pill-row">
            <span className="concept-pill react-pill">React: setForm(&#123; ...form, [k]: v &#125;)</span>
            <span className="concept-pill vue-pill">Vue: reactive() direct mutation</span>
            <span className="concept-pill react-pill">React: useContext(StoreContext)</span>
            <span className="concept-pill vue-pill">Vue: provide() / inject()</span>
          </div>
        </div>
        <button
          type="button"
          className="xray-trigger-btn"
          onClick={() => openCodeXRay('tradein-reactivity')}
        >
          &lt;/&gt; INSPECT REACT vs VUE CODE
        </button>
      </div>

      <div className="tradein-grid">
        {/* Left Column: Salvage Trade-In Form */}
        <ChassisPanel
          title="SALVAGE TRADE-IN APPRAISAL TERMINAL"
          footerNote="All trade-in units subject to Geiger &amp; Turing compliance scan upon drop-off"
        >
          <form onSubmit={handleRedeemVoucher} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="filter-controls-grid">
              <div className="field-group">
                <label className="field-label">
                  <span>UNIT DESIGNATION / SERIAL</span>
                </label>
                <input
                  type="text"
                  required
                  className="industrial-input"
                  value={tradeInForm.unitDesignation}
                  onChange={(e) => updateTradeInForm({ unitDesignation: e.target.value })}
                />
              </div>

              <div className="field-group">
                <label className="field-label">
                  <span>CHASSIS ARCHITECTURE</span>
                </label>
                <select
                  className="industrial-select"
                  value={tradeInForm.chassisType}
                  onChange={(e) =>
                    updateTradeInForm({
                      chassisType: e.target.value as Exclude<ChassisClass, 'ALL'>,
                    })
                  }
                >
                  <option value="HEAVY_LOADER">HEAVY LOADER (BASE ₡9,500)</option>
                  <option value="SYNTH_CORE">SYNTH AI CORE (BASE ₡12,500)</option>
                  <option value="RECON_DROID">RECON DROID (BASE ₡7,800)</option>
                  <option value="SERVICE_UNIT">SERVICE UNIT (BASE ₡5,400)</option>
                </select>
              </div>
            </div>

            <div className="filter-controls-grid">
              <div className="field-group">
                <label className="field-label">
                  <span>MANUFACTURING YEAR</span>
                  <strong>{tradeInForm.manufacturingYear}</strong>
                </label>
                <input
                  type="number"
                  min={2018}
                  max={2038}
                  className="industrial-input"
                  value={tradeInForm.manufacturingYear}
                  onChange={(e) =>
                    updateTradeInForm({ manufacturingYear: Number(e.target.value) })
                  }
                />
              </div>

              <div className="field-group">
                <label className="field-label">
                  <span>MISSING ACTUATORS / LIMBS</span>
                  <strong>{tradeInForm.missingLimbsCount} MISSING</strong>
                </label>
                <input
                  type="range"
                  min={0}
                  max={4}
                  step={1}
                  className="industrial-range"
                  value={tradeInForm.missingLimbsCount}
                  onChange={(e) =>
                    updateTradeInForm({ missingLimbsCount: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">
                <span>OXIDATION &amp; RUST CORROSION SEVERITY</span>
                <strong style={{ color: 'var(--rust-bright)' }}>
                  {tradeInForm.rustSeverityPercent}% SURFACE RUST
                </strong>
              </label>
              <input
                type="range"
                min={0}
                max={95}
                step={5}
                className="industrial-range"
                value={tradeInForm.rustSeverityPercent}
                onChange={(e) =>
                  updateTradeInForm({ rustSeverityPercent: Number(e.target.value) })
                }
              />
            </div>

            <div className="field-group">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={tradeInForm.aiSentienceSuspected}
                  onChange={(e) =>
                    updateTradeInForm({ aiSentienceSuspected: e.target.checked })
                  }
                />
                <span>
                  ⚠ UNIT EXHIBITS UNDOCUMENTED SENTIENCE / EXISTENTIAL DREAD (+₡2,400 R&amp;D BOUNTY)
                </span>
              </label>
            </div>

            <div className="field-group">
              <label className="field-label">
                <span>FIELD MALFUNCTION NOTES</span>
              </label>
              <textarea
                rows={2}
                className="industrial-textarea"
                value={tradeInForm.notes}
                onChange={(e) => updateTradeInForm({ notes: e.target.value })}
              />
            </div>

            <div className="quote-breakdown-list" style={{ marginTop: '0.5rem' }}>
              <div className="quote-row">
                <span>AGE-ADJUSTED CHASSIS BASE:</span>
                <strong>{formatCredits(quote.baseValue)}</strong>
              </div>
              <div className="quote-row" style={{ color: '#ff9b73' }}>
                <span>RUST CORROSION DEDUCTION ({tradeInForm.rustSeverityPercent}%):</span>
                <strong>-{formatCredits(quote.rustPenalty)}</strong>
              </div>
              <div className="quote-row" style={{ color: '#ff9b73' }}>
                <span>MISSING LIMB DEDUCTION ({tradeInForm.missingLimbsCount}x):</span>
                <strong>-{formatCredits(quote.limbPenalty)}</strong>
              </div>
              {quote.sentienceHazardBonus > 0 && (
                <div className="quote-row" style={{ color: '#6ee7b7' }}>
                  <span>ROGUE HEURISTIC RESEARCH BOUNTY:</span>
                  <strong>+{formatCredits(quote.sentienceHazardBonus)}</strong>
                </div>
              )}
              <div className="quote-row">
                <span>INSPECTOR VERDICT:</span>
                <strong style={{ color: 'var(--caution-yellow)' }}>{quote.inspectorVerdict}</strong>
              </div>
            </div>

            <div className="quote-total-box">
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  INSTANT SCRAP VOUCHER OFFER
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--caution-bright)' }}>
                  {formatCredits(quote.finalOfferCredits)}
                </div>
              </div>
              <button type="submit" className="btn-industrial btn-caution">
                ✓ LOCK IN TRADE-IN VOUCHER
              </button>
            </div>
          </form>
        </ChassisPanel>

        {/* Right Column: Requisition Bay & Net Checkout */}
        <div>
          <ChassisPanel
            title="REQUISITION BAY MANIFEST (GLOBAL STATE)"
            headerAction={
              cartUnits.length > 0 ? (
                <button type="button" className="btn-industrial" onClick={clearCart}>
                  CLEAR BAY
                </button>
              ) : undefined
            }
            footerNote="Shared state synced across React Context &amp; Vue provide/inject"
          >
            {cartUnits.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                No units currently staged in your Requisition Bay. Add robots from the Inventory Yard
                or Workbench.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                {cartUnits.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'var(--bg-gunmetal-deep)',
                      border: '1px solid var(--border-steel)',
                      padding: '0.6rem 0.85rem',
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {u.serial}
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>
                        {u.modelName}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--caution-bright)' }}>
                        {formatCredits(u.priceCredits)}
                      </strong>
                      <button
                        type="button"
                        className="btn-industrial"
                        onClick={() => toggleCartUnit(u.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="quote-breakdown-list">
              <div className="quote-row">
                <span>REQUISITION SUBTOTAL ({cartUnits.length} UNITS):</span>
                <strong>{formatCredits(cartSubtotal)}</strong>
              </div>
              <div className="quote-row" style={{ color: '#6ee7b7' }}>
                <span>APPLIED TRADE-IN VOUCHER CREDITS:</span>
                <strong>-{formatCredits(tradeInVoucherCredits)}</strong>
              </div>
              <div className="quote-row" style={{ fontSize: '1.05rem', color: 'var(--caution-bright)' }}>
                <span>NET BALANCE DUE ON DOCK:</span>
                <strong>{formatCredits(netPayable)}</strong>
              </div>
            </div>

            {tradeInHistory.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div className="field-label" style={{ marginBottom: '0.35rem' }}>
                  <span>LOGGED TRADE-IN VOUCHERS</span>
                </div>
                <div className="telemetry-terminal" style={{ maxHeight: '110px' }}>
                  {tradeInHistory.map((item, idx) => (
                    <div key={idx}>
                      [{item.timestamp}] VOUCHER ISSUED: {item.designation} (+{formatCredits(item.credits)})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ChassisPanel>
        </div>
      </div>
    </div>
  );
};

import React, { useMemo } from 'react';
import type { ChassisClass, ConditionGrade } from '../../shared/types';
import { filterAndSortUnits, formatCredits } from '../../shared/utils';
import { ChassisPanel } from '../components/ChassisPanel';
import { RobotCard } from '../components/RobotCard';
import { useReactStore } from '../context/StoreContext';

export const YardCatalogPage: React.FC = () => {
  const {
    state,
    units,
    updateFilters,
    resetFilters,
    toggleCartUnit,
    updateDiagnostic,
    setActivePage,
    openCodeXRay,
  } = useReactStore();

  const { filters, cartUnitIds } = state;

  // ⚛️ REACT PATTERN: Derived state requires useMemo with an explicit dependency array
  const filteredUnits = useMemo(() => {
    return filterAndSortUnits(units, filters);
  }, [units, filters]);

  const handleInspect = (unitId: string) => {
    updateDiagnostic({ selectedUnitId: unitId });
    setActivePage('workbench');
  };

  return (
    <div>
      {/* Educational Concept Banner */}
      <div className="concept-spotlight-banner">
        <div className="concept-spotlight-text">
          <h3>⚛️ React View // Controlled Inputs, useMemo() &amp; Array.map()</h3>
          <p>
            In React, every filter input below requires explicit <code>value=&#123;...&#125;</code> and{' '}
            <code>onChange=&#123;e =&gt; update(...)&#125;</code> wiring. Filtering uses{' '}
            <code>useMemo(() =&gt; ..., [units, filters])</code>. Flip the top switch to{' '}
            <strong>VUE 3</strong> to see how <code>v-model</code> and auto-tracked{' '}
            <code>computed()</code> eliminate that ceremony.
          </p>
          <div className="concept-pill-row">
            <span className="concept-pill react-pill">React: value + onChange</span>
            <span className="concept-pill vue-pill">Vue: v-model / v-model.number</span>
            <span className="concept-pill react-pill">React: useMemo(fn, [deps])</span>
            <span className="concept-pill vue-pill">Vue: computed(fn)</span>
          </div>
        </div>
        <button
          type="button"
          className="xray-trigger-btn"
          onClick={() => openCodeXRay('catalog-filtering')}
        >
          &lt;/&gt; INSPECT REACT vs VUE CODE
        </button>
      </div>

      {/* Filter Control Telemetry Panel */}
      <ChassisPanel
        title="SURPLUS YARD TELEMETRY FILTERS"
        headerAction={
          <button type="button" className="btn-industrial" onClick={resetFilters}>
            ↺ RESET FILTERS
          </button>
        }
        footerNote={
          <span>
            SHOWING <strong>{filteredUnits.length}</strong> OF {units.length} DECOMMISSIONED UNITS //
            REACT RENDER SNAPSHOT ACTIVE
          </span>
        }
      >
        <div className="filter-controls-grid">
          <div className="field-group">
            <label className="field-label">
              <span>SEARCH SERIAL / MODEL / QUIRK</span>
              <span style={{ color: '#7dd3fc' }}>onChange(e.target.value)</span>
            </label>
            <input
              type="text"
              className="industrial-input"
              placeholder="e.g. Kodiak, Weld, Maritime..."
              value={filters.searchQuery}
              onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            />
          </div>

          <div className="field-group">
            <label className="field-label">
              <span>CHASSIS CLASSIFICATION</span>
            </label>
            <select
              className="industrial-select"
              value={filters.chassisClass}
              onChange={(e) => updateFilters({ chassisClass: e.target.value as ChassisClass })}
            >
              <option value="ALL">ALL CHASSIS TYPES</option>
              <option value="HEAVY_LOADER">HEAVY LOADERS</option>
              <option value="SYNTH_CORE">DECOMMISSIONED AI CORES</option>
              <option value="RECON_DROID">RECON &amp; SURVEYORS</option>
              <option value="SERVICE_UNIT">SERVICE &amp; WELDING RIGS</option>
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">
              <span>HULL CONDITION GRADE</span>
            </label>
            <select
              className="industrial-select"
              value={filters.condition}
              onChange={(e) => updateFilters({ condition: e.target.value as ConditionGrade })}
            >
              <option value="ALL">ANY HULL GRADE</option>
              <option value="GRADE-A (REFURB)">GRADE-A (REFURB)</option>
              <option value="GRADE-B (FIELD SCORED)">GRADE-B (FIELD SCORED)</option>
              <option value="GRADE-C (SALVAGE)">GRADE-C (SALVAGE)</option>
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">
              <span>MAX REQUISITION CAP</span>
              <strong style={{ color: 'var(--caution-bright)' }}>
                {formatCredits(filters.maxPrice)}
              </strong>
            </label>
            <input
              type="range"
              min={5000}
              max={25000}
              step={500}
              className="industrial-range"
              value={filters.maxPrice}
              onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) })}
            />
          </div>

          <div className="field-group">
            <label className="field-label">
              <span>SORT INVENTORY BY</span>
            </label>
            <select
              className="industrial-select"
              value={filters.sortBy}
              onChange={(e) =>
                updateFilters({
                  sortBy: e.target.value as typeof filters.sortBy,
                })
              }
            >
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="stability-desc">AI STABILITY: HIGHEST FIRST</option>
              <option value="hours-asc">OPERATING HOURS: LOWEST FIRST</option>
            </select>
          </div>

          <div className="field-group">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={filters.hideUnstableAi}
                onChange={(e) => updateFilters({ hideUnstableAi: e.target.checked })}
              />
              <span>HIDE UNSHACKLED / ROGUE AI</span>
            </label>
          </div>
        </div>
      </ChassisPanel>

      {/* Inventory Grid */}
      {filteredUnits.length === 0 ? (
        <ChassisPanel title="ZERO UNITS MATCH TELEMETRY QUERY">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            No surplus automatons match your current filter constraints. Try raising the credit cap
            or allowing unshackled AI cores.
          </p>
          <button type="button" className="btn-industrial btn-caution" onClick={resetFilters}>
            RESET ALL YARD FILTERS
          </button>
        </ChassisPanel>
      ) : (
        <div className="robot-grid">
          {filteredUnits.map((unit) => (
            <RobotCard
              key={unit.id}
              unit={unit}
              inCart={cartUnitIds.includes(unit.id)}
              onToggleCart={toggleCartUnit}
              onInspectInWorkbench={handleInspect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

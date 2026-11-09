import React, { useEffect, useMemo } from 'react';
import { FIRMWARE_IMAGES } from '../../shared/inventoryData';
import { getRobotSchematicSvg } from '../../shared/robotSchematics';
import { formatCredits } from '../../shared/utils';
import { ChassisPanel } from '../components/ChassisPanel';
import { useReactStore } from '../context/StoreContext';

export const WorkbenchPage: React.FC = () => {
  const {
    state,
    units,
    updateDiagnostic,
    appendTelemetryLog,
    toggleCartUnit,
    openCodeXRay,
  } = useReactStore();

  const { diagnostic, cartUnitIds } = state;

  const selectedUnit = useMemo(() => {
    return units.find((u) => u.id === diagnostic.selectedUnitId) ?? units[0];
  }, [units, diagnostic.selectedUnitId]);

  const activeFirmware = useMemo(() => {
    return (
      FIRMWARE_IMAGES.find((f) => f.id === diagnostic.selectedFirmware) ?? FIRMWARE_IMAGES[0]
    );
  }, [diagnostic.selectedFirmware]);

  // Derived telemetry metrics
  const effectiveStability = useMemo(() => {
    const raw =
      selectedUnit.aiStabilityIndex +
      activeFirmware.stabilityDelta -
      Math.round(diagnostic.overclockPercent * 0.45) +
      (diagnostic.heuristicDampenerActive ? 12 : -10);
    return Math.max(5, Math.min(100, raw));
  }, [
    selectedUnit.aiStabilityIndex,
    activeFirmware.stabilityDelta,
    diagnostic.overclockPercent,
    diagnostic.heuristicDampenerActive,
  ]);

  const effectiveTorque = useMemo(() => {
    if (selectedUnit.specs.actuatorTorqueNm === 0) return 0;
    const multiplier = 1 + (activeFirmware.torqueDelta + diagnostic.overclockPercent) / 100;
    return Math.round(selectedUnit.specs.actuatorTorqueNm * multiplier);
  }, [selectedUnit.specs.actuatorTorqueNm, activeFirmware.torqueDelta, diagnostic.overclockPercent]);

  const coreTempCelsius = useMemo(() => {
    return Math.round(52 + diagnostic.overclockPercent * 0.85 + (diagnostic.stressTestRunning ? 18 : 0));
  }, [diagnostic.overclockPercent, diagnostic.stressTestRunning]);

  // ⚛️ REACT PATTERN: useEffect handles BOTH watching state changes AND interval cleanup on unmount
  useEffect(() => {
    if (!diagnostic.stressTestRunning) return;

    const timer = window.setInterval(() => {
      const jitter = Math.floor(Math.random() * 9) - 4;
      const stamp = new Date().toLocaleTimeString([], {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      appendTelemetryLog(
        `[${stamp}] [REACT-EFFECT] ${selectedUnit.serial} // CoreTemp: ${coreTempCelsius + jitter}°C // Stability: ${effectiveStability}%`
      );
    }, 1200);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    diagnostic.stressTestRunning,
    selectedUnit.serial,
    coreTempCelsius,
    effectiveStability,
  ]);

  const handleSelectUnit = (unitId: string) => {
    const target = units.find((u) => u.id === unitId);
    updateDiagnostic({
      selectedUnitId: unitId,
      stressTestRunning: false,
    });
    if (target) {
      appendTelemetryLog(`[SWITCH] Clamped diagnostic leads onto ${target.serial} (${target.modelName})`);
    }
  };

  return (
    <div>
      {/* Educational Concept Banner */}
      <div className="concept-spotlight-banner">
        <div className="concept-spotlight-text">
          <h3>⚛️ React View // useEffect() Lifecycle + JSX Slot Props</h3>
          <p>
            Start the <strong>LIVE SERVO STRESS TEST</strong> below! In React, a single{' '}
            <code>useEffect(fn, [stressTestRunning, ...])</code> manages the interval and its
            cleanup function. Notice also how <code>&lt;ChassisPanel headerAction=&#123;...&#125;&gt;</code>{' '}
            passes JSX as a prop, whereas Vue uses <code>&lt;template #headerAction&gt;</code> named slots.
          </p>
          <div className="concept-pill-row">
            <span className="concept-pill react-pill">React: useEffect + cleanup return</span>
            <span className="concept-pill vue-pill">Vue: watch() + onUnmounted()</span>
            <span className="concept-pill react-pill">React: headerAction=&#123;&lt;JSX /&gt;&#125;</span>
            <span className="concept-pill vue-pill">Vue: &lt;slot name=&quot;headerAction&quot;&gt;</span>
          </div>
        </div>
        <button
          type="button"
          className="xray-trigger-btn"
          onClick={() => openCodeXRay('workbench-effects')}
        >
          &lt;/&gt; INSPECT REACT vs VUE CODE
        </button>
      </div>

      <div className="workbench-layout">
        {/* Left Column: Unit Selector */}
        <ChassisPanel
          title="1. SELECT TEST CHASSIS"
          footerNote="Click any unit to re-clamp telemetry probes"
        >
          <div className="unit-selector-list">
            {units.map((u) => (
              <button
                key={u.id}
                type="button"
                className={`unit-selector-item ${u.id === selectedUnit.id ? 'selected' : ''}`}
                onClick={() => handleSelectUnit(u.id)}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--caution-yellow)',
                  }}
                >
                  {u.serial} // {formatCredits(u.priceCredits)}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.92rem' }}>
                  {u.modelName}
                </div>
              </button>
            ))}
          </div>
        </ChassisPanel>

        {/* Right Column: Live Calibration & Stress Rig */}
        <div>
          <ChassisPanel
            title={`2. CALIBRATION BAY // ${selectedUnit.serial}`}
            headerAction={
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={`btn-industrial ${diagnostic.stressTestRunning ? 'btn-rust' : 'btn-caution'}`}
                  onClick={() =>
                    updateDiagnostic({ stressTestRunning: !diagnostic.stressTestRunning })
                  }
                >
                  {diagnostic.stressTestRunning ? '⏹ ABORT STRESS TEST' : '▶ RUN LIVE STRESS TEST'}
                </button>
                <button
                  type="button"
                  className="btn-industrial"
                  onClick={() => toggleCartUnit(selectedUnit.id)}
                >
                  {cartUnitIds.includes(selectedUnit.id) ? '✓ IN REQUISITION BAY' : '+ ADD TO BAY'}
                </button>
              </div>
            }
            footerNote={
              <span>
                REACT EFFECT STATUS:{' '}
                <strong style={{ color: diagnostic.stressTestRunning ? 'var(--caution-bright)' : 'var(--text-muted)' }}>
                  {diagnostic.stressTestRunning ? 'INTERVAL ACTIVE (1200ms)' : 'IDLE / CLEANED UP'}
                </strong>
              </span>
            }
          >
            <div className="robot-visual-box" style={{ marginBottom: '1rem' }}>
              <div
                className="robot-svg-frame"
                dangerouslySetInnerHTML={{ __html: getRobotSchematicSvg(selectedUnit.svgType) }}
              />
              <div style={{ flex: 1 }}>
                <h3 className="robot-title" style={{ fontSize: '1.2rem' }}>
                  {selectedUnit.modelName}
                </h3>
                <p className="robot-maker">
                  ARMOR: {selectedUnit.specs.armorPlating} • POWER CELL: {selectedUnit.specs.batteryCells}
                </p>
              </div>
            </div>

            {/* Calibration Controls */}
            <div className="filter-controls-grid" style={{ marginBottom: '1.25rem' }}>
              <div className="field-group">
                <label className="field-label">
                  <span>BUS OVERCLOCK VOLTAGE</span>
                  <strong style={{ color: 'var(--caution-bright)' }}>
                    +{diagnostic.overclockPercent}%
                  </strong>
                </label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  className="industrial-range"
                  value={diagnostic.overclockPercent}
                  onChange={(e) =>
                    updateDiagnostic({ overclockPercent: Number(e.target.value) })
                  }
                />
              </div>

              <div className="field-group">
                <label className="field-label">
                  <span>FLASH FIRMWARE EPROM</span>
                </label>
                <select
                  className="industrial-select"
                  value={diagnostic.selectedFirmware}
                  onChange={(e) => updateDiagnostic({ selectedFirmware: e.target.value })}
                >
                  {FIRMWARE_IMAGES.map((fw) => (
                    <option key={fw.id} value={fw.id}>
                      {fw.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={diagnostic.heuristicDampenerActive}
                    onChange={(e) =>
                      updateDiagnostic({ heuristicDampenerActive: e.target.checked })
                    }
                  />
                  <span>ENGAGE OSHA HEURISTIC DAMPENER (+12% STABILITY)</span>
                </label>
              </div>
            </div>

            {/* Live Gauges */}
            <div className="telemetry-specs-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="spec-cell">
                <span>EFFECTIVE AI STABILITY</span>
                <strong
                  style={{
                    color: effectiveStability < 50 ? 'var(--rust-bright)' : '#6ee7b7',
                    fontSize: '1rem',
                  }}
                >
                  {effectiveStability}%
                </strong>
                <div className="gauge-bar-track">
                  <div
                    className="gauge-bar-fill"
                    style={{
                      width: `${effectiveStability}%`,
                      background:
                        effectiveStability < 50 ? 'var(--rust-bright)' : 'var(--vue-green)',
                    }}
                  />
                </div>
              </div>

              <div className="spec-cell">
                <span>CALIBRATED TORQUE OUTPUT</span>
                <strong style={{ color: 'var(--caution-bright)', fontSize: '1rem' }}>
                  {effectiveTorque ? `${effectiveTorque} Nm` : 'RACK LOGIC ONLY'}
                </strong>
                <div className="gauge-bar-track">
                  <div
                    className="gauge-bar-fill"
                    style={{
                      width: `${Math.min(100, (effectiveTorque / 8000) * 100)}%`,
                      background: 'var(--caution-yellow)',
                    }}
                  />
                </div>
              </div>

              <div className="spec-cell">
                <span>CHASSIS CORE TEMP</span>
                <strong
                  style={{
                    color: coreTempCelsius > 85 ? 'var(--rust-bright)' : 'var(--text-primary)',
                    fontSize: '1rem',
                  }}
                >
                  {coreTempCelsius}°C
                </strong>
                <div className="gauge-bar-track">
                  <div
                    className="gauge-bar-fill"
                    style={{
                      width: `${Math.min(100, coreTempCelsius)}%`,
                      background:
                        coreTempCelsius > 85 ? 'var(--rust-primary)' : 'var(--react-cyan)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Live Telemetry Console */}
            <div style={{ marginTop: '1rem' }}>
              <div className="field-label" style={{ marginBottom: '0.35rem' }}>
                <span>SERIAL BUS TELEMETRY STREAM</span>
                <span>STREAMING VIA REACT useEffect()</span>
              </div>
              <div className="telemetry-terminal">
                {diagnostic.telemetryLog.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          </ChassisPanel>
        </div>
      </div>
    </div>
  );
};

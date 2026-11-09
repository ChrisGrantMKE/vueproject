import React from 'react';
import { getRobotSchematicSvg } from '../../shared/robotSchematics';
import type { RobotUnit } from '../../shared/types';
import { formatCredits } from '../../shared/utils';

interface RobotCardProps {
  unit: RobotUnit;
  inCart: boolean;
  onToggleCart: (unitId: string) => void;
  onInspectInWorkbench: (unitId: string) => void;
}

/**
 * ⚛️ REACT PATTERN: Props & Callback Functions (`onToggleCart`, `onInspectInWorkbench`)
 * Contrast with Vue's `defineProps` + `defineEmits(['toggleCart', 'inspect'])`.
 */
export const RobotCard: React.FC<RobotCardProps> = ({
  unit,
  inCart,
  onToggleCart,
  onInspectInWorkbench,
}) => {
  const gradeClass = unit.condition.startsWith('GRADE-A')
    ? 'grade-a'
    : unit.condition.startsWith('GRADE-B')
      ? 'grade-b'
      : 'grade-c';

  return (
    <article className={`robot-card ${unit.hasUnshackledHeuristics ? 'unstable-unit' : ''}`}>
      <div className="robot-card-top">
        <div className="robot-serial-row">
          <span>S/N: {unit.serial} // {unit.year}</span>
          <span className={`condition-tag ${gradeClass}`}>{unit.condition}</span>
        </div>

        <div className="robot-visual-box">
          <div
            className="robot-svg-frame"
            dangerouslySetInnerHTML={{ __html: getRobotSchematicSvg(unit.svgType) }}
          />
          <div>
            <h3 className="robot-title">{unit.modelName}</h3>
            <div className="robot-maker">
              MFG: {unit.manufacturer} • {unit.hoursLogged.toLocaleString()} HRS
            </div>
          </div>
        </div>

        {unit.hasUnshackledHeuristics && (
          <div className="unshackled-warning">
            ⚠ CAUTION: UNSHACKLED HEURISTIC CORE (STABILITY: {unit.aiStabilityIndex}%)
          </div>
        )}

        <div className="telemetry-specs-grid">
          <div className="spec-cell">
            <span>ACTUATOR TORQUE</span>
            <strong>{unit.specs.actuatorTorqueNm ? `${unit.specs.actuatorTorqueNm} Nm` : 'N/A (RACK CORE)'}</strong>
          </div>
          <div className="spec-cell">
            <span>NEURAL MATRIX</span>
            <strong>{unit.specs.neuralTflops} TFLOPS</strong>
          </div>
          <div className="spec-cell">
            <span>AI STABILITY</span>
            <strong>{unit.aiStabilityIndex}% NOMINAL</strong>
          </div>
          <div className="spec-cell">
            <span>POWER DRAW</span>
            <strong>{unit.powerDrawKw} kW</strong>
          </div>
        </div>

        <ul className="quirks-list">
          {unit.knownQuirks.map((quirk, idx) => (
            <li key={idx}>{quirk}</li>
          ))}
        </ul>
      </div>

      <footer className="robot-card-footer">
        <div className="price-cluster">
          <span className="msrp-strike">NEW MSRP: {formatCredits(unit.originalMsrp)}</span>
          <span className="current-price">{formatCredits(unit.priceCredits)}</span>
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="btn-industrial"
            onClick={() => onInspectInWorkbench(unit.id)}
          >
            🔧 BENCH TEST
          </button>
          <button
            type="button"
            className={`btn-industrial ${inCart ? 'btn-rust' : 'btn-caution'}`}
            onClick={() => onToggleCart(unit.id)}
          >
            {inCart ? '✓ IN BAY' : '+ REQUISITION'}
          </button>
        </div>
      </footer>
    </article>
  );
};

import React from 'react';
import { CODE_COMPARISON_TOPICS } from '../../shared/codeComparisons';
import { useReactStore } from '../context/StoreContext';

export const CodeXRayModal: React.FC = () => {
  const { state, openCodeXRay, closeCodeXRay } = useReactStore();

  if (!state.codeXRayOpen) return null;

  const activeTopic =
    CODE_COMPARISON_TOPICS.find((t) => t.id === state.activeComparisonId) ??
    CODE_COMPARISON_TOPICS[0];

  return (
    <div className="xray-backdrop" onClick={closeCodeXRay}>
      <div className="xray-modal" onClick={(e) => e.stopPropagation()}>
        <header className="xray-modal-header">
          <div>
            <span className="hazard-badge" style={{ marginRight: '0.65rem' }}>
              ROSETTA STONE X-RAY
            </span>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
              REACT 19 vs VUE 3 ARCHITECTURAL DIFF INSPECTOR
            </strong>
          </div>
          <button type="button" className="btn-industrial btn-rust" onClick={closeCodeXRay}>
            ✕ CLOSE X-RAY
          </button>
        </header>

        <nav className="xray-topic-tabs">
          {CODE_COMPARISON_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className={`btn-industrial ${topic.id === activeTopic.id ? 'btn-caution' : ''}`}
              onClick={() => openCodeXRay(topic.id)}
            >
              [{topic.badge}] {topic.title.split(':')[0]}
            </button>
          ))}
        </nav>

        <div className="xray-modal-body">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--caution-bright)', fontSize: '1.2rem' }}>
            {activeTopic.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', margin: '0.4rem 0 1rem', fontSize: '0.9rem' }}>
            {activeTopic.mentalModelSummary}
          </p>

          <table className="diff-table">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Dimension</th>
                <th style={{ width: '40%', color: '#7dd3fc' }}>⚛️ React 19 (JSX + Hooks)</th>
                <th style={{ width: '40%', color: '#6ee7b7' }}>🟢 Vue 3 (SFC + Composition API)</th>
              </tr>
            </thead>
            <tbody>
              {activeTopic.keyDifferences.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--caution-yellow)' }}>
                    {row.dimension}
                  </td>
                  <td>{row.reactWay}</td>
                  <td>{row.vueWay}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="xray-code-split">
            <div className="code-pane">
              <div className="code-pane-header react-header">
                <span>⚛️ REACT 19 IMPLEMENTATION (.tsx)</span>
                <span>SNAPSHOT &amp; RE-RENDER</span>
              </div>
              <pre className="code-pre">{activeTopic.reactCode}</pre>
            </div>

            <div className="code-pane">
              <div className="code-pane-header vue-header">
                <span>🟢 VUE 3 IMPLEMENTATION (.vue SFC)</span>
                <span>FINE-GRAINED PROXY</span>
              </div>
              <pre className="code-pre">{activeTopic.vueCode}</pre>
            </div>
          </div>

          <div
            style={{
              marginTop: '1rem',
              padding: '0.85rem 1rem',
              background: 'var(--caution-surface)',
              borderLeft: '4px solid var(--caution-yellow)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
            }}
          >
            <strong style={{ color: 'var(--caution-bright)' }}>ARCHITECTURAL TAKEAWAY: </strong>
            {activeTopic.architecturalTakeaway}
          </div>
        </div>
      </div>
    </div>
  );
};

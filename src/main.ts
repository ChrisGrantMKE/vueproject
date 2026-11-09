import React from 'react';
import { createRoot, type Root as ReactDomRoot } from 'react-dom/client';
import { createApp, type App as VueAppInstance } from 'vue';
import { ReactRoot } from './react-app/ReactRoot';
import { bridgeStore } from './shared/bridgeStore';
import type { FrameworkEngine } from './shared/types';
import './styles/industrial.css';
import VueRoot from './vue-app/VueRoot.vue';

const switchShellEl = document.getElementById('global-switch-shell')!;
const viewportEl = document.getElementById('engine-viewport')!;

let activeReactRoot: ReactDomRoot | null = null;
let activeVueApp: VueAppInstance | null = null;
let lastMountedEngine: FrameworkEngine | null = null;

function unmountEngines() {
  if (activeReactRoot) {
    activeReactRoot.unmount();
    activeReactRoot = null;
  }
  if (activeVueApp) {
    activeVueApp.unmount();
    activeVueApp = null;
  }
  viewportEl.innerHTML = '';
}

function mountEngine(engine: FrameworkEngine) {
  if (lastMountedEngine === engine) return;
  unmountEngines();
  lastMountedEngine = engine;

  if (engine === 'react') {
    const reactMount = document.createElement('div');
    viewportEl.appendChild(reactMount);
    activeReactRoot = createRoot(reactMount);
    activeReactRoot.render(React.createElement(ReactRoot));
  } else if (engine === 'vue') {
    const vueMount = document.createElement('div');
    viewportEl.appendChild(vueMount);
    activeVueApp = createApp(VueRoot);
    activeVueApp.mount(vueMount);
  } else if (engine === 'split') {
    const splitGrid = document.createElement('div');
    splitGrid.className = 'split-engine-grid';

    const leftPane = document.createElement('div');
    leftPane.className = 'split-pane';

    const rightPane = document.createElement('div');
    rightPane.className = 'split-pane';

    splitGrid.appendChild(leftPane);
    splitGrid.appendChild(rightPane);
    viewportEl.appendChild(splitGrid);

    activeReactRoot = createRoot(leftPane);
    activeReactRoot.render(React.createElement(ReactRoot));

    activeVueApp = createApp(VueRoot);
    activeVueApp.mount(rightPane);
  }
}

function renderGlobalSwitchBar() {
  const state = bridgeStore.getState();

  switchShellEl.innerHTML = `
    <div class="hazard-stripe-bar"></div>
    <header class="global-switch-header">
      <div class="global-switch-inner">
        <div class="switch-brand-cluster">
          <span class="hazard-badge">CAUTION // DUAL-RUNTIME LAB</span>
          <div>
            <div class="switch-title">REACT 19 vs VUE 3 // INTERACTIVE ROSETTA STONE</div>
            <div class="switch-subtitle">
              Flip the master breaker to hot-swap the entire site between React (.tsx) and Vue (.vue) without losing state
            </div>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem;">
          <div class="engine-toggle-group" role="group" aria-label="Framework Engine Switch">
            <button
              type="button"
              id="btn-engine-react"
              class="engine-toggle-btn ${state.engine === 'react' ? 'active-react' : ''}"
            >
              <span>⚛️ REACT 19 (.TSX)</span>
            </button>
            <button
              type="button"
              id="btn-engine-vue"
              class="engine-toggle-btn ${state.engine === 'vue' ? 'active-vue' : ''}"
            >
              <span>🟢 VUE 3.5 (.VUE SFC)</span>
            </button>
            <button
              type="button"
              id="btn-engine-split"
              class="engine-toggle-btn ${state.engine === 'split' ? 'active-split' : ''}"
              title="Run both React 19 and Vue 3 side-by-side simultaneously!"
            >
              <span>⚡ DUAL SPLIT-SCREEN</span>
            </button>
          </div>

          <button type="button" id="btn-global-xray" class="xray-trigger-btn">
            <span>&lt;/&gt; CODE X-RAY DIFF</span>
          </button>
        </div>
      </div>
      <div class="rust-stripe-bar"></div>
    </header>
  `;

  document.getElementById('btn-engine-react')?.addEventListener('click', () => {
    bridgeStore.setEngine('react');
  });

  document.getElementById('btn-engine-vue')?.addEventListener('click', () => {
    bridgeStore.setEngine('vue');
  });

  document.getElementById('btn-engine-split')?.addEventListener('click', () => {
    bridgeStore.setEngine('split');
  });

  document.getElementById('btn-global-xray')?.addEventListener('click', () => {
    bridgeStore.setCodeXRay(!bridgeStore.getState().codeXRayOpen);
  });
}

// Initial boot
renderGlobalSwitchBar();
mountEngine(bridgeStore.getState().engine);

bridgeStore.subscribe((nextState) => {
  renderGlobalSwitchBar();
  mountEngine(nextState.engine);
});

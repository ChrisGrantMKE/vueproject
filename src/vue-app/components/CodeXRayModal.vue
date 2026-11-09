<script setup lang="ts">
import { computed, inject } from 'vue';
import { CODE_COMPARISON_TOPICS } from '../../shared/codeComparisons';
import { VUE_STORE_KEY } from '../storeKey';

const store = inject(VUE_STORE_KEY)!;

const activeTopic = computed(() => {
  return (
    CODE_COMPARISON_TOPICS.find((t) => t.id === store.state.activeComparisonId) ??
    CODE_COMPARISON_TOPICS[0]
  );
});
</script>

<template>
  <div v-if="store.state.codeXRayOpen" class="xray-backdrop" @click="store.closeCodeXRay()">
    <div class="xray-modal" @click.stop>
      <header class="xray-modal-header">
        <div>
          <span class="hazard-badge" style="margin-right: 0.65rem">ROSETTA STONE X-RAY</span>
          <strong style="font-family: var(--font-display); font-size: 1.1rem">
            REACT 19 vs VUE 3 ARCHITECTURAL DIFF INSPECTOR
          </strong>
        </div>
        <button type="button" class="btn-industrial btn-rust" @click="store.closeCodeXRay()">
          ✕ CLOSE X-RAY
        </button>
      </header>

      <nav class="xray-topic-tabs">
        <button
          v-for="topic in CODE_COMPARISON_TOPICS"
          :key="topic.id"
          type="button"
          class="btn-industrial"
          :class="{ 'btn-caution': topic.id === activeTopic.id }"
          @click="store.openCodeXRay(topic.id)"
        >
          [{{ topic.badge }}] {{ topic.title.split(':')[0] }}
        </button>
      </nav>

      <div class="xray-modal-body">
        <h3 style="font-family: var(--font-display); color: var(--caution-bright); font-size: 1.2rem">
          {{ activeTopic.title }}
        </h3>
        <p style="color: var(--text-secondary); margin: 0.4rem 0 1rem; font-size: 0.9rem">
          {{ activeTopic.mentalModelSummary }}
        </p>

        <table class="diff-table">
          <thead>
            <tr>
              <th style="width: 20%">Dimension</th>
              <th style="width: 40%; color: #7dd3fc">⚛️ React 19 (JSX + Hooks)</th>
              <th style="width: 40%; color: #6ee7b7">🟢 Vue 3 (SFC + Composition API)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in activeTopic.keyDifferences" :key="idx">
              <td style="font-family: var(--font-mono); font-weight: 600; color: var(--caution-yellow)">
                {{ row.dimension }}
              </td>
              <td>{{ row.reactWay }}</td>
              <td>{{ row.vueWay }}</td>
            </tr>
          </tbody>
        </table>

        <div class="xray-code-split">
          <div class="code-pane">
            <div class="code-pane-header react-header">
              <span>⚛️ REACT 19 IMPLEMENTATION (.tsx)</span>
              <span>SNAPSHOT &amp; RE-RENDER</span>
            </div>
            <pre class="code-pre">{{ activeTopic.reactCode }}</pre>
          </div>

          <div class="code-pane">
            <div class="code-pane-header vue-header">
              <span>🟢 VUE 3 IMPLEMENTATION (.vue SFC)</span>
              <span>FINE-GRAINED PROXY</span>
            </div>
            <pre class="code-pre">{{ activeTopic.vueCode }}</pre>
          </div>
        </div>

        <div
          style="
            margin-top: 1rem;
            padding: 0.85rem 1rem;
            background: var(--caution-surface);
            border-left: 4px solid var(--caution-yellow);
            font-family: var(--font-mono);
            font-size: 0.8rem;
          "
        >
          <strong style="color: var(--caution-bright)">ARCHITECTURAL TAKEAWAY: </strong>
          {{ activeTopic.architecturalTakeaway }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { ChassisClass, ConditionGrade } from '../../shared/types';
import { filterAndSortUnits, formatCredits } from '../../shared/utils';
import ChassisPanel from '../components/ChassisPanel.vue';
import RobotCard from '../components/RobotCard.vue';
import { VUE_STORE_KEY } from '../storeKey';

const store = inject(VUE_STORE_KEY)!;

// 🟢 VUE 3 PATTERN: Two-way computed getters/setters or direct reactive bindings
// allow `<input v-model="searchQuery" />` with zero manual event-handler boilerplate!
const searchQuery = computed({
  get: () => store.state.filters.searchQuery,
  set: (val: string) => store.updateFilters({ searchQuery: val }),
});

const chassisClass = computed({
  get: () => store.state.filters.chassisClass,
  set: (val: ChassisClass) => store.updateFilters({ chassisClass: val }),
});

const condition = computed({
  get: () => store.state.filters.condition,
  set: (val: ConditionGrade) => store.updateFilters({ condition: val }),
});

const maxPrice = computed({
  get: () => store.state.filters.maxPrice,
  set: (val: number) => store.updateFilters({ maxPrice: Number(val) }),
});

const sortBy = computed({
  get: () => store.state.filters.sortBy,
  set: (val) => store.updateFilters({ sortBy: val }),
});

const hideUnstableAi = computed({
  get: () => store.state.filters.hideUnstableAi,
  set: (val: boolean) => store.updateFilters({ hideUnstableAi: val }),
});

// 🟢 VUE 3 PATTERN: Automatic dependency tracking! No dependency array `[units, filters]` required.
const filteredUnits = computed(() => {
  return filterAndSortUnits(store.units, store.state.filters);
});

function handleInspect(unitId: string) {
  store.updateDiagnostic({ selectedUnitId: unitId });
  store.setActivePage('workbench');
}
</script>

<template>
  <div>
    <!-- Educational Concept Banner -->
    <div class="concept-spotlight-banner">
      <div class="concept-spotlight-text">
        <h3>🟢 Vue 3 View // Two-Way v-model, Auto-Tracked computed() &amp; v-for Directives</h3>
        <p>
          In Vue 3, inputs bind directly via <code>v-model</code> and <code>v-model.number</code>.
          <code>computed(() =&gt; filterAndSortUnits(...))</code> automatically tracks every
          reactive property read inside it—no manual dependency array required!
        </p>
        <div class="concept-pill-row">
          <span class="concept-pill vue-pill">Vue: v-model / v-model.number</span>
          <span class="concept-pill react-pill">React: value + onChange</span>
          <span class="concept-pill vue-pill">Vue: computed(fn) (Auto-Tracked)</span>
          <span class="concept-pill vue-pill">Vue: v-for / v-if / v-else</span>
        </div>
      </div>
      <button
        type="button"
        class="xray-trigger-btn"
        @click="store.openCodeXRay('catalog-filtering')"
      >
        &lt;/&gt; INSPECT REACT vs VUE CODE
      </button>
    </div>

    <!-- Filter Control Telemetry Panel using Vue Named Slots -->
    <ChassisPanel title="SURPLUS YARD TELEMETRY FILTERS">
      <template #headerAction>
        <button type="button" class="btn-industrial" @click="store.resetFilters()">
          ↺ RESET FILTERS
        </button>
      </template>

      <div class="filter-controls-grid">
        <div class="field-group">
          <label class="field-label">
            <span>SEARCH SERIAL / MODEL / QUIRK</span>
            <span style="color: #6ee7b7">v-model="searchQuery"</span>
          </label>
          <input
            v-model="searchQuery"
            type="text"
            class="industrial-input"
            placeholder="e.g. Kodiak, Weld, Maritime..."
          />
        </div>

        <div class="field-group">
          <label class="field-label">
            <span>CHASSIS CLASSIFICATION</span>
          </label>
          <select v-model="chassisClass" class="industrial-select">
            <option value="ALL">ALL CHASSIS TYPES</option>
            <option value="HEAVY_LOADER">HEAVY LOADERS</option>
            <option value="SYNTH_CORE">DECOMMISSIONED AI CORES</option>
            <option value="RECON_DROID">RECON &amp; SURVEYORS</option>
            <option value="SERVICE_UNIT">SERVICE &amp; WELDING RIGS</option>
          </select>
        </div>

        <div class="field-group">
          <label class="field-label">
            <span>HULL CONDITION GRADE</span>
          </label>
          <select v-model="condition" class="industrial-select">
            <option value="ALL">ANY HULL GRADE</option>
            <option value="GRADE-A (REFURB)">GRADE-A (REFURB)</option>
            <option value="GRADE-B (FIELD SCORED)">GRADE-B (FIELD SCORED)</option>
            <option value="GRADE-C (SALVAGE)">GRADE-C (SALVAGE)</option>
          </select>
        </div>

        <div class="field-group">
          <label class="field-label">
            <span>MAX REQUISITION CAP</span>
            <strong style="color: var(--caution-bright)">
              {{ formatCredits(maxPrice) }}
            </strong>
          </label>
          <input
            v-model.number="maxPrice"
            type="range"
            :min="5000"
            :max="25000"
            :step="500"
            class="industrial-range"
          />
        </div>

        <div class="field-group">
          <label class="field-label">
            <span>SORT INVENTORY BY</span>
          </label>
          <select v-model="sortBy" class="industrial-select">
            <option value="price-asc">PRICE: LOW TO HIGH</option>
            <option value="price-desc">PRICE: HIGH TO LOW</option>
            <option value="stability-desc">AI STABILITY: HIGHEST FIRST</option>
            <option value="hours-asc">OPERATING HOURS: LOWEST FIRST</option>
          </select>
        </div>

        <div class="field-group">
          <label class="checkbox-row">
            <input v-model="hideUnstableAi" type="checkbox" />
            <span>HIDE UNSHACKLED / ROGUE AI</span>
          </label>
        </div>
      </div>

      <template #footerNote>
        <span>
          SHOWING <strong>{{ filteredUnits.length }}</strong> OF {{ store.units.length }} DECOMMISSIONED
          UNITS // VUE COMPUTED PROXY GRAPH ACTIVE
        </span>
      </template>
    </ChassisPanel>

    <!-- Declarative v-if / v-else & v-for Rendering -->
    <ChassisPanel v-if="filteredUnits.length === 0" title="ZERO UNITS MATCH TELEMETRY QUERY">
      <p style="color: var(--text-secondary); margin-bottom: 0.75rem">
        No surplus automatons match your current filter constraints. Try raising the credit cap or
        allowing unshackled AI cores.
      </p>
      <button type="button" class="btn-industrial btn-caution" @click="store.resetFilters()">
        RESET ALL YARD FILTERS
      </button>
    </ChassisPanel>

    <div v-else class="robot-grid">
      <RobotCard
        v-for="unit in filteredUnits"
        :key="unit.id"
        :unit="unit"
        :in-cart="store.state.cartUnitIds.includes(unit.id)"
        @toggle-cart="store.toggleCartUnit"
        @inspect="handleInspect"
      />
    </div>
  </div>
</template>

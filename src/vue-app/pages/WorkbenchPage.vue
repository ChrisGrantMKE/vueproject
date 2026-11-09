<script setup lang="ts">
import { computed, inject, onUnmounted, watch } from 'vue';
import { FIRMWARE_IMAGES } from '../../shared/inventoryData';
import { getRobotSchematicSvg } from '../../shared/robotSchematics';
import { formatCredits } from '../../shared/utils';
import ChassisPanel from '../components/ChassisPanel.vue';
import { VUE_STORE_KEY } from '../storeKey';

const store = inject(VUE_STORE_KEY)!;

const selectedUnit = computed(() => {
  return (
    store.units.find((u) => u.id === store.state.diagnostic.selectedUnitId) ?? store.units[0]
  );
});

const activeFirmware = computed(() => {
  return (
    FIRMWARE_IMAGES.find((f) => f.id === store.state.diagnostic.selectedFirmware) ??
    FIRMWARE_IMAGES[0]
  );
});

const overclockPercent = computed({
  get: () => store.state.diagnostic.overclockPercent,
  set: (val: number) => store.updateDiagnostic({ overclockPercent: Number(val) }),
});

const selectedFirmware = computed({
  get: () => store.state.diagnostic.selectedFirmware,
  set: (val: string) => store.updateDiagnostic({ selectedFirmware: val }),
});

const heuristicDampenerActive = computed({
  get: () => store.state.diagnostic.heuristicDampenerActive,
  set: (val: boolean) => store.updateDiagnostic({ heuristicDampenerActive: val }),
});

// 🟢 VUE 3 PATTERN: Auto-tracked computed properties for live gauges
const effectiveStability = computed(() => {
  const raw =
    selectedUnit.value.aiStabilityIndex +
    activeFirmware.value.stabilityDelta -
    Math.round(store.state.diagnostic.overclockPercent * 0.45) +
    (store.state.diagnostic.heuristicDampenerActive ? 12 : -10);
  return Math.max(5, Math.min(100, raw));
});

const effectiveTorque = computed(() => {
  if (selectedUnit.value.specs.actuatorTorqueNm === 0) return 0;
  const multiplier =
    1 + (activeFirmware.value.torqueDelta + store.state.diagnostic.overclockPercent) / 100;
  return Math.round(selectedUnit.value.specs.actuatorTorqueNm * multiplier);
});

const coreTempCelsius = computed(() => {
  return Math.round(
    52 +
      store.state.diagnostic.overclockPercent * 0.85 +
      (store.state.diagnostic.stressTestRunning ? 18 : 0)
  );
});

const schematicHtml = computed(() => getRobotSchematicSvg(selectedUnit.value.svgType));

// 🟢 VUE 3 PATTERN: Explicit `watch()` for reactive state transitions + `onUnmounted()` for lifecycle cleanup
let stressTimer: number | null = null;

function stopTimer() {
  if (stressTimer !== null) {
    window.clearInterval(stressTimer);
    stressTimer = null;
  }
}

watch(
  () => store.state.diagnostic.stressTestRunning,
  (isRunning) => {
    stopTimer();
    if (isRunning) {
      stressTimer = window.setInterval(() => {
        const jitter = Math.floor(Math.random() * 9) - 4;
        const stamp = new Date().toLocaleTimeString([], {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        store.appendTelemetryLog(
          `[${stamp}] [VUE-WATCHER] ${selectedUnit.value.serial} // CoreTemp: ${coreTempCelsius.value + jitter}°C // Stability: ${effectiveStability.value}%`
        );
      }, 1200);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  stopTimer();
});

function handleSelectUnit(unitId: string) {
  const target = store.units.find((u) => u.id === unitId);
  store.updateDiagnostic({
    selectedUnitId: unitId,
    stressTestRunning: false,
  });
  if (target) {
    store.appendTelemetryLog(
      `[SWITCH] Clamped diagnostic leads onto ${target.serial} (${target.modelName})`
    );
  }
}
</script>

<template>
  <div>
    <!-- Educational Concept Banner -->
    <div class="concept-spotlight-banner">
      <div class="concept-spotlight-text">
        <h3>🟢 Vue 3 View // Explicit watch(), onUnmounted() &amp; Named &lt;slot&gt; Outlets</h3>
        <p>
          In Vue 3, reactive observers (<code>watch</code>) are separated from component lifecycle
          hooks (<code>onMounted</code> / <code>onUnmounted</code>). Also note how{' '}
          <code>&lt;template #headerAction&gt;</code> projects buttons into{' '}
          <code>ChassisPanel</code>’s named <code>&lt;slot name=&quot;headerAction&quot; /&gt;</code>!
        </p>
        <div class="concept-pill-row">
          <span class="concept-pill vue-pill">Vue: watch(source, cb) + onUnmounted()</span>
          <span class="concept-pill react-pill">React: useEffect(fn, [deps])</span>
          <span class="concept-pill vue-pill">Vue: &lt;template #headerAction&gt;</span>
          <span class="concept-pill react-pill">React: headerAction=&#123;&lt;JSX /&gt;&#125;</span>
        </div>
      </div>
      <button
        type="button"
        class="xray-trigger-btn"
        @click="store.openCodeXRay('workbench-effects')"
      >
        &lt;/&gt; INSPECT REACT vs VUE CODE
      </button>
    </div>

    <div class="workbench-layout">
      <!-- Left Column: Unit Selector -->
      <ChassisPanel title="1. SELECT TEST CHASSIS">
        <div class="unit-selector-list">
          <button
            v-for="u in store.units"
            :key="u.id"
            type="button"
            class="unit-selector-item"
            :class="{ selected: u.id === selectedUnit.id }"
            @click="handleSelectUnit(u.id)"
          >
            <div
              style="
                font-family: var(--font-mono);
                font-size: 0.72rem;
                color: var(--caution-yellow);
              "
            >
              {{ u.serial }} // {{ formatCredits(u.priceCredits) }}
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.92rem">
              {{ u.modelName }}
            </div>
          </button>
        </div>

        <template #footerNote>
          Click any unit to re-clamp telemetry probes
        </template>
      </ChassisPanel>

      <!-- Right Column: Live Calibration & Stress Rig -->
      <div>
        <ChassisPanel :title="`2. CALIBRATION BAY // ${selectedUnit.serial}`">
          <template #headerAction>
            <div style="display: flex; gap: 0.5rem">
              <button
                type="button"
                class="btn-industrial"
                :class="store.state.diagnostic.stressTestRunning ? 'btn-rust' : 'btn-caution'"
                @click="
                  store.updateDiagnostic({
                    stressTestRunning: !store.state.diagnostic.stressTestRunning,
                  })
                "
              >
                {{
                  store.state.diagnostic.stressTestRunning
                    ? '⏹ ABORT STRESS TEST'
                    : '▶ RUN LIVE STRESS TEST'
                }}
              </button>
              <button
                type="button"
                class="btn-industrial"
                @click="store.toggleCartUnit(selectedUnit.id)"
              >
                {{
                  store.state.cartUnitIds.includes(selectedUnit.id)
                    ? '✓ IN REQUISITION BAY'
                    : '+ ADD TO BAY'
                }}
              </button>
            </div>
          </template>

          <div class="robot-visual-box" style="margin-bottom: 1rem">
            <div class="robot-svg-frame" v-html="schematicHtml" />
            <div style="flex: 1">
              <h3 class="robot-title" style="font-size: 1.2rem">
                {{ selectedUnit.modelName }}
              </h3>
              <p class="robot-maker">
                ARMOR: {{ selectedUnit.specs.armorPlating }} • POWER CELL:
                {{ selectedUnit.specs.batteryCells }}
              </p>
            </div>
          </div>

          <!-- Calibration Controls with v-model -->
          <div class="filter-controls-grid" style="margin-bottom: 1.25rem">
            <div class="field-group">
              <label class="field-label">
                <span>BUS OVERCLOCK VOLTAGE</span>
                <strong style="color: var(--caution-bright)">+{{ overclockPercent }}%</strong>
              </label>
              <input
                v-model.number="overclockPercent"
                type="range"
                :min="0"
                :max="50"
                :step="5"
                class="industrial-range"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <span>FLASH FIRMWARE EPROM</span>
              </label>
              <select v-model="selectedFirmware" class="industrial-select">
                <option v-for="fw in FIRMWARE_IMAGES" :key="fw.id" :value="fw.id">
                  {{ fw.label }}
                </option>
              </select>
            </div>

            <div class="field-group">
              <label class="checkbox-row">
                <input v-model="heuristicDampenerActive" type="checkbox" />
                <span>ENGAGE OSHA HEURISTIC DAMPENER (+12% STABILITY)</span>
              </label>
            </div>
          </div>

          <!-- Live Gauges -->
          <div class="telemetry-specs-grid" style="grid-template-columns: repeat(3, 1fr)">
            <div class="spec-cell">
              <span>EFFECTIVE AI STABILITY</span>
              <strong
                :style="{
                  color: effectiveStability < 50 ? 'var(--rust-bright)' : '#6ee7b7',
                  fontSize: '1rem',
                }"
              >
                {{ effectiveStability }}%
              </strong>
              <div class="gauge-bar-track">
                <div
                  class="gauge-bar-fill"
                  :style="{
                    width: `${effectiveStability}%`,
                    background:
                      effectiveStability < 50 ? 'var(--rust-bright)' : 'var(--vue-green)',
                  }"
                />
              </div>
            </div>

            <div class="spec-cell">
              <span>CALIBRATED TORQUE OUTPUT</span>
              <strong style="color: var(--caution-bright); font-size: 1rem">
                {{ effectiveTorque ? `${effectiveTorque} Nm` : 'RACK LOGIC ONLY' }}
              </strong>
              <div class="gauge-bar-track">
                <div
                  class="gauge-bar-fill"
                  :style="{
                    width: `${Math.min(100, (effectiveTorque / 8000) * 100)}%`,
                    background: 'var(--caution-yellow)',
                  }"
                />
              </div>
            </div>

            <div class="spec-cell">
              <span>CHASSIS CORE TEMP</span>
              <strong
                :style="{
                  color: coreTempCelsius > 85 ? 'var(--rust-bright)' : 'var(--text-primary)',
                  fontSize: '1rem',
                }"
              >
                {{ coreTempCelsius }}°C
              </strong>
              <div class="gauge-bar-track">
                <div
                  class="gauge-bar-fill"
                  :style="{
                    width: `${Math.min(100, coreTempCelsius)}%`,
                    background:
                      coreTempCelsius > 85 ? 'var(--rust-primary)' : 'var(--react-cyan)',
                  }"
                />
              </div>
            </div>
          </div>

          <!-- Live Telemetry Console -->
          <div style="margin-top: 1rem">
            <div class="field-label" style="margin-bottom: 0.35rem">
              <span>SERIAL BUS TELEMETRY STREAM</span>
              <span>STREAMING VIA VUE watch() + onUnmounted()</span>
            </div>
            <div class="telemetry-terminal">
              <div v-for="(line, i) in store.state.diagnostic.telemetryLog" :key="i">
                {{ line }}
              </div>
            </div>
          </div>

          <template #footerNote>
            <span>
              VUE WATCHER STATUS:
              <strong
                :style="{
                  color: store.state.diagnostic.stressTestRunning
                    ? '#6ee7b7'
                    : 'var(--text-muted)',
                }"
              >
                {{
                  store.state.diagnostic.stressTestRunning
                    ? 'WATCHER INTERVAL RUNNING (1200ms)'
                    : 'IDLE / STANDBY'
                }}
              </strong>
            </span>
          </template>
        </ChassisPanel>
      </div>
    </div>
  </div>
</template>

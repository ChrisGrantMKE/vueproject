<script setup lang="ts">
import { computed } from 'vue';
import { getRobotSchematicSvg } from '../../shared/robotSchematics';
import type { RobotUnit } from '../../shared/types';
import { formatCredits } from '../../shared/utils';

/**
 * 🟢 VUE 3 PATTERN: Typed `defineProps` + `defineEmits` for Child -> Parent communication.
 * Parent listens using `@toggle-cart="..."` and `@inspect="..."`.
 */
const props = defineProps<{
  unit: RobotUnit;
  inCart: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-cart', unitId: string): void;
  (e: 'inspect', unitId: string): void;
}>();

const gradeClass = computed(() => {
  if (props.unit.condition.startsWith('GRADE-A')) return 'grade-a';
  if (props.unit.condition.startsWith('GRADE-B')) return 'grade-b';
  return 'grade-c';
});

const schematicHtml = computed(() => getRobotSchematicSvg(props.unit.svgType));
</script>

<template>
  <article class="robot-card" :class="{ 'unstable-unit': unit.hasUnshackledHeuristics }">
    <div class="robot-card-top">
      <div class="robot-serial-row">
        <span>S/N: {{ unit.serial }} // {{ unit.year }}</span>
        <span class="condition-tag" :class="gradeClass">{{ unit.condition }}</span>
      </div>

      <div class="robot-visual-box">
        <div class="robot-svg-frame" v-html="schematicHtml" />
        <div>
          <h3 class="robot-title">{{ unit.modelName }}</h3>
          <div class="robot-maker">
            MFG: {{ unit.manufacturer }} • {{ unit.hoursLogged.toLocaleString() }} HRS
          </div>
        </div>
      </div>

      <div v-if="unit.hasUnshackledHeuristics" class="unshackled-warning">
        ⚠ CAUTION: UNSHACKLED HEURISTIC CORE (STABILITY: {{ unit.aiStabilityIndex }}%)
      </div>

      <div class="telemetry-specs-grid">
        <div class="spec-cell">
          <span>ACTUATOR TORQUE</span>
          <strong>
            {{ unit.specs.actuatorTorqueNm ? `${unit.specs.actuatorTorqueNm} Nm` : 'N/A (RACK CORE)' }}
          </strong>
        </div>
        <div class="spec-cell">
          <span>NEURAL MATRIX</span>
          <strong>{{ unit.specs.neuralTflops }} TFLOPS</strong>
        </div>
        <div class="spec-cell">
          <span>AI STABILITY</span>
          <strong>{{ unit.aiStabilityIndex }}% NOMINAL</strong>
        </div>
        <div class="spec-cell">
          <span>POWER DRAW</span>
          <strong>{{ unit.powerDrawKw }} kW</strong>
        </div>
      </div>

      <ul class="quirks-list">
        <li v-for="(quirk, idx) in unit.knownQuirks" :key="idx">
          {{ quirk }}
        </li>
      </ul>
    </div>

    <footer class="robot-card-footer">
      <div class="price-cluster">
        <span class="msrp-strike">NEW MSRP: {{ formatCredits(unit.originalMsrp) }}</span>
        <span class="current-price">{{ formatCredits(unit.priceCredits) }}</span>
      </div>

      <div class="card-actions">
        <button type="button" class="btn-industrial" @click="emit('inspect', unit.id)">
          🔧 BENCH TEST
        </button>
        <button
          type="button"
          class="btn-industrial"
          :class="inCart ? 'btn-rust' : 'btn-caution'"
          @click="emit('toggle-cart', unit.id)"
        >
          {{ inCart ? '✓ IN BAY' : '+ REQUISITION' }}
        </button>
      </div>
    </footer>
  </article>
</template>

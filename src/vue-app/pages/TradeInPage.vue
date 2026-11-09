<script setup lang="ts">
import { computed, inject } from 'vue';
import type { ChassisClass } from '../../shared/types';
import { calculateTradeInQuote, formatCredits } from '../../shared/utils';
import ChassisPanel from '../components/ChassisPanel.vue';
import { VUE_STORE_KEY } from '../storeKey';

const store = inject(VUE_STORE_KEY)!;

// 🟢 VUE 3 PATTERN: Deeply reactive bindings for multi-field form state
const unitDesignation = computed({
  get: () => store.state.tradeInForm.unitDesignation,
  set: (v: string) => store.updateTradeInForm({ unitDesignation: v }),
});

const chassisType = computed({
  get: () => store.state.tradeInForm.chassisType,
  set: (v: Exclude<ChassisClass, 'ALL'>) => store.updateTradeInForm({ chassisType: v }),
});

const manufacturingYear = computed({
  get: () => store.state.tradeInForm.manufacturingYear,
  set: (v: number) => store.updateTradeInForm({ manufacturingYear: Number(v) }),
});

const missingLimbsCount = computed({
  get: () => store.state.tradeInForm.missingLimbsCount,
  set: (v: number) => store.updateTradeInForm({ missingLimbsCount: Number(v) }),
});

const rustSeverityPercent = computed({
  get: () => store.state.tradeInForm.rustSeverityPercent,
  set: (v: number) => store.updateTradeInForm({ rustSeverityPercent: Number(v) }),
});

const aiSentienceSuspected = computed({
  get: () => store.state.tradeInForm.aiSentienceSuspected,
  set: (v: boolean) => store.updateTradeInForm({ aiSentienceSuspected: v }),
});

const notes = computed({
  get: () => store.state.tradeInForm.notes,
  set: (v: string) => store.updateTradeInForm({ notes: v }),
});

const quote = computed(() => calculateTradeInQuote(store.state.tradeInForm));

const cartUnits = computed(() =>
  store.units.filter((u) => store.state.cartUnitIds.includes(u.id))
);

const cartSubtotal = computed(() =>
  cartUnits.value.reduce((sum, u) => sum + u.priceCredits, 0)
);

const netPayable = computed(() =>
  Math.max(0, cartSubtotal.value - store.state.tradeInVoucherCredits)
);

function handleRedeemVoucher() {
  if (!unitDesignation.value.trim()) return;
  store.redeemTradeInQuote(unitDesignation.value, quote.value.finalOfferCredits);
}
</script>

<template>
  <div>
    <!-- Educational Concept Banner -->
    <div class="concept-spotlight-banner">
      <div class="concept-spotlight-text">
        <h3>🟢 Vue 3 View // Deep Reactive Proxies, @submit.prevent &amp; provide / inject</h3>
        <p>
          In Vue 3, forms use event modifiers like <code>@submit.prevent</code> (no manual{' '}
          <code>e.preventDefault()</code> needed) and <code>v-model.number</code> for automatic
          numeric coercion. Shared state is injected via <code>inject(VUE_STORE_KEY)</code>.
        </p>
        <div class="concept-pill-row">
          <span class="concept-pill vue-pill">Vue: @submit.prevent modifier</span>
          <span class="concept-pill vue-pill">Vue: reactive() Proxy mutation</span>
          <span class="concept-pill react-pill">React: setForm(&#123; ...form, [k]: v &#125;)</span>
          <span class="concept-pill vue-pill">Vue: provide() / inject()</span>
        </div>
      </div>
      <button
        type="button"
        class="xray-trigger-btn"
        @click="store.openCodeXRay('tradein-reactivity')"
      >
        &lt;/&gt; INSPECT REACT vs VUE CODE
      </button>
    </div>

    <div class="tradein-grid">
      <!-- Left Column: Salvage Trade-In Form -->
      <ChassisPanel title="SALVAGE TRADE-IN APPRAISAL TERMINAL">
        <form
          style="display: flex; flex-direction: column; gap: 1rem"
          @submit.prevent="handleRedeemVoucher"
        >
          <div class="filter-controls-grid">
            <div class="field-group">
              <label class="field-label">
                <span>UNIT DESIGNATION / SERIAL</span>
              </label>
              <input v-model="unitDesignation" type="text" required class="industrial-input" />
            </div>

            <div class="field-group">
              <label class="field-label">
                <span>CHASSIS ARCHITECTURE</span>
              </label>
              <select v-model="chassisType" class="industrial-select">
                <option value="HEAVY_LOADER">HEAVY LOADER (BASE ₡9,500)</option>
                <option value="SYNTH_CORE">SYNTH AI CORE (BASE ₡12,500)</option>
                <option value="RECON_DROID">RECON DROID (BASE ₡7,800)</option>
                <option value="SERVICE_UNIT">SERVICE UNIT (BASE ₡5,400)</option>
              </select>
            </div>
          </div>

          <div class="filter-controls-grid">
            <div class="field-group">
              <label class="field-label">
                <span>MANUFACTURING YEAR</span>
                <strong>{{ manufacturingYear }}</strong>
              </label>
              <input
                v-model.number="manufacturingYear"
                type="number"
                :min="2018"
                :max="2038"
                class="industrial-input"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <span>MISSING ACTUATORS / LIMBS</span>
                <strong>{{ missingLimbsCount }} MISSING</strong>
              </label>
              <input
                v-model.number="missingLimbsCount"
                type="range"
                :min="0"
                :max="4"
                :step="1"
                class="industrial-range"
              />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">
              <span>OXIDATION &amp; RUST CORROSION SEVERITY</span>
              <strong style="color: var(--rust-bright)">
                {{ rustSeverityPercent }}% SURFACE RUST
              </strong>
            </label>
            <input
              v-model.number="rustSeverityPercent"
              type="range"
              :min="0"
              :max="95"
              :step="5"
              class="industrial-range"
            />
          </div>

          <div class="field-group">
            <label class="checkbox-row">
              <input v-model="aiSentienceSuspected" type="checkbox" />
              <span>
                ⚠ UNIT EXHIBITS UNDOCUMENTED SENTIENCE / EXISTENTIAL DREAD (+₡2,400 R&amp;D BOUNTY)
              </span>
            </label>
          </div>

          <div class="field-group">
            <label class="field-label">
              <span>FIELD MALFUNCTION NOTES</span>
            </label>
            <textarea v-model="notes" rows="2" class="industrial-textarea" />
          </div>

          <div class="quote-breakdown-list" style="margin-top: 0.5rem">
            <div class="quote-row">
              <span>AGE-ADJUSTED CHASSIS BASE:</span>
              <strong>{{ formatCredits(quote.baseValue) }}</strong>
            </div>
            <div class="quote-row" style="color: #ff9b73">
              <span>RUST CORROSION DEDUCTION ({{ rustSeverityPercent }}%):</span>
              <strong>-{{ formatCredits(quote.rustPenalty) }}</strong>
            </div>
            <div class="quote-row" style="color: #ff9b73">
              <span>MISSING LIMB DEDUCTION ({{ missingLimbsCount }}x):</span>
              <strong>-{{ formatCredits(quote.limbPenalty) }}</strong>
            </div>
            <div v-if="quote.sentienceHazardBonus > 0" class="quote-row" style="color: #6ee7b7">
              <span>ROGUE HEURISTIC RESEARCH BOUNTY:</span>
              <strong>+{{ formatCredits(quote.sentienceHazardBonus) }}</strong>
            </div>
            <div class="quote-row">
              <span>INSPECTOR VERDICT:</span>
              <strong style="color: var(--caution-yellow)">{{ quote.inspectorVerdict }}</strong>
            </div>
          </div>

          <div class="quote-total-box">
            <div>
              <div style="font-size: 0.72rem; color: var(--text-secondary)">
                INSTANT SCRAP VOUCHER OFFER
              </div>
              <div style="font-size: 1.4rem; font-weight: 700; color: var(--caution-bright)">
                {{ formatCredits(quote.finalOfferCredits) }}
              </div>
            </div>
            <button type="submit" class="btn-industrial btn-caution">
              ✓ LOCK IN TRADE-IN VOUCHER
            </button>
          </div>
        </form>

        <template #footerNote>
          All trade-in units subject to Geiger &amp; Turing compliance scan upon drop-off
        </template>
      </ChassisPanel>

      <!-- Right Column: Requisition Bay & Net Checkout -->
      <div>
        <ChassisPanel title="REQUISITION BAY MANIFEST (GLOBAL STATE)">
          <template v-if="cartUnits.length > 0" #headerAction>
            <button type="button" class="btn-industrial" @click="store.clearCart()">
              CLEAR BAY
            </button>
          </template>

          <p
            v-if="cartUnits.length === 0"
            style="
              color: var(--text-secondary);
              font-family: var(--font-mono);
              font-size: 0.82rem;
            "
          >
            No units currently staged in your Requisition Bay. Add robots from the Inventory Yard or
            Workbench.
          </p>

          <div
            v-else
            style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem"
          >
            <div
              v-for="u in cartUnits"
              :key="u.id"
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--bg-gunmetal-deep);
                border: 1px solid var(--border-steel);
                padding: 0.6rem 0.85rem;
              "
            >
              <div>
                <div
                  style="
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    color: var(--text-muted);
                  "
                >
                  {{ u.serial }}
                </div>
                <div
                  style="font-family: var(--font-display); font-weight: 700; font-size: 0.9rem"
                >
                  {{ u.modelName }}
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.75rem">
                <strong style="font-family: var(--font-mono); color: var(--caution-bright)">
                  {{ formatCredits(u.priceCredits) }}
                </strong>
                <button
                  type="button"
                  class="btn-industrial"
                  @click="store.toggleCartUnit(u.id)"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div class="quote-breakdown-list">
            <div class="quote-row">
              <span>REQUISITION SUBTOTAL ({{ cartUnits.length }} UNITS):</span>
              <strong>{{ formatCredits(cartSubtotal) }}</strong>
            </div>
            <div class="quote-row" style="color: #6ee7b7">
              <span>APPLIED TRADE-IN VOUCHER CREDITS:</span>
              <strong>-{{ formatCredits(store.state.tradeInVoucherCredits) }}</strong>
            </div>
            <div class="quote-row" style="font-size: 1.05rem; color: var(--caution-bright)">
              <span>NET BALANCE DUE ON DOCK:</span>
              <strong>{{ formatCredits(netPayable) }}</strong>
            </div>
          </div>

          <div v-if="store.state.tradeInHistory.length > 0" style="margin-top: 1rem">
            <div class="field-label" style="margin-bottom: 0.35rem">
              <span>LOGGED TRADE-IN VOUCHERS</span>
            </div>
            <div class="telemetry-terminal" style="max-height: 110px">
              <div v-for="(item, idx) in store.state.tradeInHistory" :key="idx">
                [{{ item.timestamp }}] VOUCHER ISSUED: {{ item.designation }} (+{{
                  formatCredits(item.credits)
                }})
              </div>
            </div>
          </div>

          <template #footerNote>
            Shared state synced across Vue provide/inject &amp; React Context
          </template>
        </ChassisPanel>
      </div>
    </div>
  </div>
</template>

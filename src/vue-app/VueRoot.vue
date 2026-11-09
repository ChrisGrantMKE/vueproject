<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, reactive } from 'vue';
import { bridgeStore, type SharedAppState } from '../shared/bridgeStore';
import { ROBOT_INVENTORY } from '../shared/inventoryData';
import { formatCredits } from '../shared/utils';
import CodeXRayModal from './components/CodeXRayModal.vue';
import TradeInPage from './pages/TradeInPage.vue';
import WorkbenchPage from './pages/WorkbenchPage.vue';
import YardCatalogPage from './pages/YardCatalogPage.vue';
import { VUE_STORE_KEY, type VueStoreContext } from './storeKey';

// 🟢 VUE 3 PATTERN: Deeply reactive Proxy state synchronized with the cross-framework bridge
const reactiveState = reactive<SharedAppState>(structuredClone(bridgeStore.getState()));

let unsubscribe: (() => void) | null = null;

onMounted(() => {
  unsubscribe = bridgeStore.subscribe((next) => {
    bridgeStore.recordVueTrigger();
    Object.assign(reactiveState, structuredClone(next));
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const storeContext: VueStoreContext = {
  state: reactiveState,
  units: ROBOT_INVENTORY,
  setActivePage: (page) => bridgeStore.setActivePage(page),
  openCodeXRay: (topicId) => bridgeStore.setCodeXRay(true, topicId),
  closeCodeXRay: () => bridgeStore.setCodeXRay(false),
  toggleCartUnit: (unitId) => bridgeStore.toggleCartUnit(unitId),
  clearCart: () => bridgeStore.clearCart(),
  updateFilters: (patch) => bridgeStore.updateFilters(patch),
  resetFilters: () => bridgeStore.resetFilters(),
  updateDiagnostic: (patch) => bridgeStore.updateDiagnostic(patch),
  appendTelemetryLog: (entry) => bridgeStore.appendTelemetryLog(entry),
  updateTradeInForm: (patch) => bridgeStore.updateTradeInForm(patch),
  redeemTradeInQuote: (designation, credits) =>
    bridgeStore.redeemTradeInQuote(designation, credits),
};

// 🟢 VUE 3 PATTERN: Provide store to all descendant components via Dependency Injection
provide(VUE_STORE_KEY, storeContext);

const netTotal = computed(() => {
  const subtotal = ROBOT_INVENTORY.filter((u) =>
    reactiveState.cartUnitIds.includes(u.id)
  ).reduce((sum, u) => sum + u.priceCredits, 0);
  return Math.max(0, subtotal - reactiveState.tradeInVoucherCredits);
});
</script>

<template>
  <div class="app-shell">
    <!-- Live Runtime Status Indicator -->
    <div class="runtime-status-strip is-vue">
      <div>
        <strong style="color: #6ee7b7">
          🟢 ACTIVE RUNTIME: VUE 3.5 (SINGLE-FILE COMPONENTS + PROXY REACTIVITY)
        </strong>
        <span style="color: var(--text-secondary)">
          // Rendering via <code>createApp(VueRoot).mount()</code>
        </span>
      </div>
      <div style="display: flex; gap: 1rem; align-items: center">
        <span>
          VUE PROXY TRIGGERS:
          <strong style="color: #6ee7b7">
            {{ reactiveState.telemetryCounters.vueReactiveTriggers }}
          </strong>
        </span>
        <button
          type="button"
          class="btn-industrial"
          style="padding: 0.25rem 0.6rem; font-size: 0.7rem"
          @click="storeContext.openCodeXRay('paradigm-overview')"
        >
          ? HOW VUE DIFFERS FROM REACT
        </button>
      </div>
    </div>

    <!-- Industrial Storefront Header -->
    <header class="store-header">
      <div class="store-header-top">
        <div>
          <h1 class="brand-headline">
            <span>RUST &amp; SILICON</span>
            <span class="rust-accent">//</span>
            <span class="yellow-accent">SURPLUS AUTOMATA</span>
          </h1>
          <p class="brand-tagline">
            Certified Pre-Owned Heavy Robotics, Salvaged Actuators &amp; Decommissioned AI Cores •
            Sector 7G Foundry Yard
          </p>
        </div>

        <div class="cart-requisition-box">
          <div class="cart-requisition-title">
            REQUISITION BAY ({{ reactiveState.cartUnitIds.length }} UNITS)
          </div>
          <div class="cart-requisition-values">
            <span style="color: var(--caution-bright)">{{ formatCredits(netTotal) }}</span>
            <span
              v-if="reactiveState.tradeInVoucherCredits > 0"
              style="font-size: 0.72rem; color: #6ee7b7"
            >
              (VOUCHER: -{{ formatCredits(reactiveState.tradeInVoucherCredits) }})
            </span>
          </div>
        </div>
      </div>

      <!-- Page Navigation with Vue Concept Labels -->
      <nav class="store-nav-tabs">
        <button
          type="button"
          class="nav-tab-btn"
          :class="{ active: reactiveState.activePage === 'catalog' }"
          @click="storeContext.setActivePage('catalog')"
        >
          <span>01. SURPLUS YARD CATALOG</span>
          <span class="nav-tab-concept">v-model + computed + v-for</span>
        </button>

        <button
          type="button"
          class="nav-tab-btn"
          :class="{ active: reactiveState.activePage === 'workbench' }"
          @click="storeContext.setActivePage('workbench')"
        >
          <span>02. DIAGNOSTIC WORKBENCH</span>
          <span class="nav-tab-concept">watch() + onUnmounted + &lt;slot&gt;</span>
        </button>

        <button
          type="button"
          class="nav-tab-btn"
          :class="{ active: reactiveState.activePage === 'tradein' }"
          @click="storeContext.setActivePage('tradein')"
        >
          <span>03. SALVAGE APPRAISAL &amp; CHECKOUT</span>
          <span class="nav-tab-concept">reactive() + provide/inject</span>
        </button>
      </nav>
    </header>

    <!-- Active Page Outlet -->
    <main>
      <YardCatalogPage v-if="reactiveState.activePage === 'catalog'" />
      <WorkbenchPage v-else-if="reactiveState.activePage === 'workbench'" />
      <TradeInPage v-else />
    </main>

    <!-- Code X-Ray Modal -->
    <CodeXRayModal />
  </div>
</template>

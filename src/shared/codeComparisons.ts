import type { CodeComparisonTopic } from './types';

export const CODE_COMPARISON_TOPICS: CodeComparisonTopic[] = [
  {
    id: 'paradigm-overview',
    page: 'global',
    title: 'Core Mental Model: Re-Renders vs Fine-Grained Proxies',
    badge: 'ARCHITECTURE 101',
    mentalModelSummary:
      'React is built around immutable state snapshots and re-executing your component function on every update. Vue 3 runs your <script setup> function ONCE per component mount and uses JavaScript Proxies to track exactly which DOM nodes depend on which reactive variables.',
    keyDifferences: [
      {
        dimension: 'Component Execution',
        reactWay: 'Function runs on EVERY render. Local variables reset unless wrapped in useRef/useMemo/useState.',
        vueWay: '<script setup> runs ONCE when created. Reactive refs automatically update only the specific template bindings.'
      },
      {
        dimension: 'State Mutation',
        reactWay: 'Strictly IMMUTABLE: Must call setState(prev => ({ ...prev, count: prev.count + 1 })).',
        vueWay: 'Controlled MUTATION via Proxy: count.value++ or form.rustSeverity = 40 triggers reactive updates.'
      },
      {
        dimension: 'File Format',
        reactWay: '.tsx (JavaScript/TypeScript controls HTML via JSX). Everything is a JS expression.',
        vueWay: '.vue Single-File Component (SFC): Dedicated <script setup>, <template>, and <style scoped> blocks.'
      }
    ],
    reactCode: `// ⚛️ REACT 19: Component function re-runs on EVERY state change
export function PriceCounter({ basePrice }: { basePrice: number }) {
  const [overclock, setOverclock] = useState(10);

  // Recalculated on every render (or memoized via useMemo)
  const finalPrice = useMemo(() => {
    return basePrice + overclock * 150;
  }, [basePrice, overclock]); // <-- Manual dependency array!

  return (
    <button onClick={() => setOverclock(prev => prev + 5)}>
      Price: {finalPrice} CR
    </button>
  );
}`,
    vueCode: `<!-- 🟢 VUE 3: <script setup> runs ONCE. Proxies track dependencies! -->
<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{ basePrice: number }>();
const overclock = ref(10);

// Automatic dependency tracking — no dependency array needed!
const finalPrice = computed(() => {
  return props.basePrice + overclock.value * 150;
});
</script>

<template>
  <button @click="overclock += 5">
    Price: {{ finalPrice }} CR
  </button>
</template>`,
    architecturalTakeaway:
      'In React, you think in "Snapshots & Re-renders" (always asking: what triggers a re-render, and what needs a dependency array?). In Vue, you think in "Reactive Wiring" (set up your refs and computed properties once, and let the Proxy graph update the DOM surgically).'
  },
  {
    id: 'catalog-filtering',
    page: 'catalog',
    title: 'Page 1 (Scrap Yard): Two-Way Binding (v-model) & Derived Lists',
    badge: 'CATALOG // FORMS & LISTS',
    mentalModelSummary:
      'On the Surplus Inventory Yard page, we filter 7 robots across 5 criteria (Search, Class, Grade, Max Price, Stability Checkbox). Compare how React requires explicit value + onChange wiring for every input, while Vue uses v-model directives and automatic computed() dependencies.',
    keyDifferences: [
      {
        dimension: 'Form Input Binding',
        reactWay: 'Controlled inputs require both value={state} and onChange={e => setState(e.target.value)} (or e.target.checked).',
        vueWay: 'v-model="filters.searchQuery" automatically handles text, checkboxes, radios, and number coercion (.number).'
      },
      {
        dimension: 'Derived Filtered List',
        reactWay: 'useMemo(() => filterFn(), [search, chassis, grade, maxPrice, hideUnstable]) — forget a dep and you get stale bugs.',
        vueWay: 'computed(() => filterFn()) — Vue intercepts every property read during execution and tracks dependencies automatically.'
      },
      {
        dimension: 'Template Loops & Conditionals',
        reactWay: 'JavaScript expressions inside braces: {items.length === 0 ? <Empty /> : items.map(u => <Card key={u.id} />)}',
        vueWay: 'Declarative HTML directives: <Empty v-if="!items.length" /> and <Card v-else v-for="u in items" :key="u.id" />'
      }
    ],
    reactCode: `// ⚛️ REACT 19: Explicit onChange handlers + manual dependency array
const [search, setSearch] = useState('');
const [hideUnstable, setHideUnstable] = useState(false);

const filteredUnits = useMemo(() => {
  return units.filter(u =>
    u.modelName.toLowerCase().includes(search.toLowerCase()) &&
    (!hideUnstable || !u.hasUnshackledHeuristics)
  );
}, [units, search, hideUnstable]);

return (
  <>
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <input
      type="checkbox"
      checked={hideUnstable}
      onChange={(e) => setHideUnstable(e.target.checked)}
    />
    {filteredUnits.map(unit => (
      <RobotCard key={unit.id} unit={unit} onAdd={handleAdd} />
    ))}
  </>
);`,
    vueCode: `<!-- 🟢 VUE 3: v-model two-way binding + auto-tracked computed() -->
<script setup lang="ts">
import { ref, computed } from 'vue';

const search = ref('');
const hideUnstable = ref(false);

const filteredUnits = computed(() =>
  units.filter(u =>
    u.modelName.toLowerCase().includes(search.value.toLowerCase()) &&
    (!hideUnstable.value || !u.hasUnshackledHeuristics)
  )
);
</script>

<template>
  <input v-model="search" />
  <input type="checkbox" v-model="hideUnstable" />
  <RobotCard
    v-for="unit in filteredUnits"
    :key="unit.id"
    :unit="unit"
    @add="handleAdd"
  />
</template>`,
    architecturalTakeaway:
      'Vue’s v-model and computed() eliminate ~40% of UI boilerplate on filter-heavy dashboards while preventing stale closure bugs from missing dependency array items.'
  },
  {
    id: 'workbench-effects',
    page: 'workbench',
    title: 'Page 2 (Diagnostic Bay): Watchers, Lifecycle & Slots vs Children',
    badge: 'WORKBENCH // EFFECTS & SLOTS',
    mentalModelSummary:
      'On the Diagnostic Workbench page, selecting a robot or running a live servo stress-test timer triggers side effects, interval cleanup, and custom panel layouts. This highlights how React unifies everything into useEffect + children props, whereas Vue separates watch(), onMounted/onUnmounted, and named <slot> outlets.',
    keyDifferences: [
      {
        dimension: 'Side Effects & Timers',
        reactWay: 'useEffect(() => { const id = setInterval(...); return () => clearInterval(id); }, [isRunning])',
        vueWay: 'watch(isRunning, (running) => { ... }) + onUnmounted(() => clearInterval(id)) — explicit trigger vs lifecycle.'
      },
      {
        dimension: 'Child -> Parent Events',
        reactWay: 'Pass callback functions down as regular props: <RobotCard onInspect={(id) => select(id)} />',
        vueWay: 'Child emits typed events via defineEmits; parent listens with @inspect="(id) => select(id)".'
      },
      {
        dimension: 'Content Projection (Slots)',
        reactWay: 'Pass JSX via children prop or named props like headerSlot={<Badge />}.',
        vueWay: 'Native Web-Component-style <slot /> and <slot name="header" /> populated via <template #header>.'
      }
    ],
    reactCode: `// ⚛️ REACT 19: useEffect handles both lifecycle and state watching
useEffect(() => {
  if (!stressTestRunning) return;

  const timer = setInterval(() => {
    setTelemetry(prev => [...prev.slice(-7), generateSample()]);
  }, 900);

  // Cleanup runs on unmount OR whenever dependencies change
  return () => clearInterval(timer);
}, [stressTestRunning, selectedUnitId]);

// Named slot equivalent via JSX props:
<ChassisPanel
  title="SERVO TELEMETRY"
  headerAction={<button onClick={stop}>ABORT</button>}
>
  <TelemetryGraph data={telemetry} />
</ChassisPanel>`,
    vueCode: `<!-- 🟢 VUE 3: Dedicated watch() + onUnmounted() + Named <slot> -->
<script setup lang="ts">
import { watch, onUnmounted } from 'vue';

let timer: number | null = null;

watch([stressTestRunning, selectedUnitId], ([running]) => {
  if (timer) clearInterval(timer);
  if (running) {
    timer = window.setInterval(() => {
      telemetry.value.push(generateSample());
    }, 900);
  }
});

onUnmounted(() => { if (timer) clearInterval(timer); });
</script>

<template>
  <ChassisPanel title="SERVO TELEMETRY">
    <template #headerAction>
      <button @click="stop">ABORT</button>
    </template>
    <TelemetryGraph :data="telemetry" />
  </ChassisPanel>
</template>`,
    architecturalTakeaway:
      'React’s useEffect synchronizes component state with external systems on render boundaries. Vue separates lifecycle hooks (onMounted/onUnmounted) from reactive data observers (watch/watchEffect), making it explicit WHICH state change triggers a side effect.'
  },
  {
    id: 'tradein-reactivity',
    page: 'tradein',
    title: 'Page 3 (Appraisal Terminal): Deep Reactive Objects vs Immutable Spreads',
    badge: 'TRADE-IN // DEEP STATE & CONTEXT',
    mentalModelSummary:
      'On the Salvage Appraisal & Trade-In page, a multi-field form computes a live scrap buyout quote and interacts with the global Requisition Cart. Compare React’s immutable object updates ({ ...form, field: value }) and useContext() against Vue’s deep reactive() proxy and provide() / inject().',
    keyDifferences: [
      {
        dimension: 'Multi-Field Form State',
        reactWay: 'setForm(prev => ({ ...prev, rustSeverityPercent: Number(e.target.value) })) — must clone object reference.',
        vueWay: 'const form = reactive({ rustSeverityPercent: 25, ... }); bound directly via v-model.number="form.rustSeverityPercent".'
      },
      {
        dimension: 'Global Store / DI',
        reactWay: '<StoreContext.Provider value={store}> + const store = useContext(StoreContext).',
        vueWay: 'provide("store", store) in parent component + const store = inject("store") in any descendant.'
      }
    ],
    reactCode: `// ⚛️ REACT 19: Immutable state cloning + Context Consumer
const { cart, addTradeInCredit } = useStoreContext();
const [form, setForm] = useState<TradeInSubmission>(INITIAL_FORM);

const updateField = <K extends keyof TradeInSubmission>(
  key: K,
  value: TradeInSubmission[K]
) => {
  // Must create a brand new object reference to trigger re-render
  setForm(prev => ({ ...prev, [key]: value }));
};

<input
  type="range"
  value={form.rustSeverityPercent}
  onChange={e => updateField('rustSeverityPercent', Number(e.target.value))}
/>`,
    vueCode: `<!-- 🟢 VUE 3: Deep reactive() Proxy + provide/inject -->
<script setup lang="ts">
import { reactive, inject } from 'vue';

const { cart, addTradeInCredit } = inject('store')!;

// Deeply reactive Proxy: nested property mutations are tracked!
const form = reactive<TradeInSubmission>({ ...INITIAL_FORM });
</script>

<template>
  <!-- Direct mutation under the hood via v-model.number -->
  <input
    type="range"
    v-model.number="form.rustSeverityPercent"
  />
</template>`,
    architecturalTakeaway:
      'With Vue’s reactive(), mutating properties directly (form.rustSeverityPercent = 50) is idiomatic and tracked at the property level. In React, mutating an object in-place is a bug because React relies on Object.is(oldState, newState) reference inequality to detect changes.'
  }
];

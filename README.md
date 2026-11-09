# RUST & SILICON // Surplus Robotics & AI Store
### Interactive React 19 vs. Vue 3.5 Rosetta Stone

An education-first, dual-runtime web application styled as a heavy industrial used-robotics & decommissioned AI salvage yard (**Gunmetal, Rust, and Caution Work Yellow**).

The entire storefront is implemented **twice** inside a single Vite bundle:
1. **⚛️ React 19 Engine (`src/react-app/*.tsx`)** — JSX, `useState`, `useMemo`, `useEffect`, `createContext`/`useContext`, controlled inputs, and JSX prop slots.
2. **🟢 Vue 3.5 Engine (`src/vue-app/*.vue`)** — Single-File Components (`.vue`), `<script setup lang="ts">`, `ref`, `reactive`, `computed`, `watch`, `onUnmounted`, `provide`/`inject`, `v-model`, `v-if`/`v-for`, and named `<slot>` outlets.

Use the **Top Master Breaker Switch** to hot-swap the active runtime between **React 19**, **Vue 3.5**, or **⚡ Dual Split-Screen Mode** (where both engines run side-by-side simultaneously) without losing your current page, filters, workbench telemetry, or requisition cart state.

---

## Core Architectural Comparisons Demonstrated

| Page | Storefront Feature | ⚛️ React 19 Pattern | 🟢 Vue 3.5 Pattern |
| :--- | :--- | :--- | :--- |
| **01. Surplus Yard Catalog** | Multi-criteria search, range slider, checkbox, sort, and card grid | Controlled inputs (`value` + `onChange`), `useMemo(() => ..., [deps])`, `Array.map()` | Two-way `v-model` / `v-model.number`, auto-tracked `computed()`, declarative `v-for` & `v-if`/`v-else` |
| **02. Diagnostic Workbench** | Live servo stress-test interval timer, firmware flashing, and custom panel actions | `useEffect()` with cleanup return + dependency array; JSX passed via props (`headerAction={<JSX />}`) | Explicit `watch()` separated from `onUnmounted()`; native `<slot>` and `<template #headerAction>` |
| **03. Salvage Appraisal & Checkout** | Multi-field trade-in calculator + global requisition cart | Immutable object cloning (`{ ...form, [key]: val }`) + `useContext(StoreContext)` | Deep `reactive()` Proxy mutation + `@submit.prevent` modifier + `provide()` / `inject()` |

---

## Running Locally

```bash
cd C:\code\vueproject
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

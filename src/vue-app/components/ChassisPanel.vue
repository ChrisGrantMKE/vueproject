<script setup lang="ts">
/**
 * 🟢 VUE 3 PATTERN: Content Projection via native <slot /> and named <slot name="headerAction" />.
 * Contrast with React passing JSX elements through props (`headerAction={<button/>}`).
 */
defineProps<{
  title: string;
}>();
</script>

<template>
  <section class="chassis-panel">
    <header class="chassis-panel-header">
      <div class="chassis-panel-title-wrap">
        <span class="rivet-dot" />
        <h2 class="chassis-panel-title">{{ title }}</h2>
      </div>
      <div v-if="$slots.headerAction">
        <slot name="headerAction" />
      </div>
    </header>

    <div class="chassis-panel-body">
      <slot />
    </div>

    <footer v-if="$slots.footerNote" class="chassis-panel-footer">
      <slot name="footerNote" />
    </footer>
  </section>
</template>

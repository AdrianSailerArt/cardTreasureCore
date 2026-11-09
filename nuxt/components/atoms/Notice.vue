<script setup lang="ts">
/** Kurze Rückmeldung (Erfolg, Fehler, Hinweis) in der Farbe aus dem Color-Set; wird angesagt (Fehler sofort als `alert`). */
withDefaults(defineProps<{ tone?: 'success' | 'warning' | 'danger' | 'info' }>(), { tone: 'info' })
const toneClass = { success: 'text-success', warning: 'text-warning', danger: 'text-danger', info: 'text-info' }
</script>

<template>
  <p class="text-sm" :class="toneClass[tone]" :role="tone === 'danger' ? 'alert' : 'status'">
    <slot />
  </p>
</template>

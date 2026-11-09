<script setup lang="ts">
/** Umschalt-Chip für Filter (an/aus). Kantig, Versalien; Zustand auch für Screenreader (`aria-pressed`). */
defineProps<{ active?: boolean }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    class="inline-flex min-h-8 items-center gap-1.5 rounded-md px-3 text-[11px] font-semibold uppercase tracking-[0.08em] transition"
    :class="active ? 'bg-accent-soft text-accent' : 'bg-surface-muted text-fg-muted hover:text-fg'"
    :aria-pressed="active ? 'true' : 'false'"
    @click="$emit('click')"
  >
    <span class="h-1.5 w-1.5 rounded-[1px]" :class="active ? 'bg-accent' : 'bg-fg-faint'" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup lang="ts">
/** Leerzustand: was fehlt und was man tun kann. Text im Standard-Slot, Aktion (Button/Link) im Slot `action`. */
defineProps<{ title?: string | null }>()
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-dashed border-line-strong px-5 py-4" role="status">
    <div class="min-w-0">
      <p v-if="title" class="font-semibold">{{ title }}</p>
      <p class="text-small text-fg-muted"><slot /></p>
    </div>
    <div v-if="$slots.action" class="shrink-0"><slot name="action" /></div>
  </div>
</template>

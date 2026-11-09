<script setup lang="ts">
/** Liste „Bezeichnung … Wert“ (Kontodaten, Bestand, Bestellangaben). */
defineProps<{ items: { label: string, value: string | number }[] }>()
</script>

<template>
  <dl class="divide-y divide-line text-sm">
    <div v-for="item in items" :key="item.label" class="flex justify-between gap-4 py-2 first:pt-0 last:pb-0">
      <dt class="text-fg-muted">{{ item.label }}</dt>
      <dd class="text-right tabular-nums">{{ item.value }}</dd>
    </div>
  </dl>
</template>

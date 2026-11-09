<script setup lang="ts" generic="T extends string | number">
/** Umschalter mit wenigen Optionen, z.B. Zeitraum 7/30/90 Tage. Kantig, Versalien; gewählte Option mit `aria-pressed`. */
defineProps<{ options: { value: T, label: string }[], label?: string }>()
const model = defineModel<T>({ required: true })
</script>

<template>
  <div class="inline-flex gap-1 rounded-md bg-surface-muted p-1" role="group" :aria-label="label">
    <button
      v-for="o in options"
      :key="String(o.value)"
      type="button"
      class="min-h-8 rounded-sm px-3 text-button-sm transition"
      :class="model === o.value ? 'bg-primary text-on-primary' : 'text-fg-muted hover:text-fg'"
      :aria-pressed="model === o.value ? 'true' : 'false'"
      @click="model = o.value"
    >
      {{ o.label }}
    </button>
  </div>
</template>

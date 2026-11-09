<script setup lang="ts">
/**
 * Fläche für zusammengehörige Inhalte (Abschnitte, Kacheln, Formulare) in allen Bereichen.
 * Optional Titel (h2) mit Aktionen rechts. `padding` none/sm/md, `as` für das HTML-Element (section, div, article …).
 */
withDefaults(defineProps<{ title?: string | null, padding?: 'none' | 'sm' | 'md', as?: string }>(), { padding: 'md', as: 'section' })
const PAD = { none: '', sm: 'p-4', md: 'p-5' }
</script>

<template>
  <component :is="as" class="rounded-lg border border-line bg-surface" :class="PAD[padding]">
    <div v-if="title || $slots.actions" class="mb-4 flex flex-wrap items-center justify-between gap-3" :class="{ 'px-5 pt-5': padding === 'none' }">
      <h2 v-if="title" class="text-xl">{{ title }}</h2>
      <slot name="actions" />
    </div>
    <slot />
  </component>
</template>

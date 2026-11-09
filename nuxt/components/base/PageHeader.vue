<script setup lang="ts">
/**
 * Seitenkopf für alle Bereiche (Shop, Kundenkonto, CMS): optionale Überzeile, Titel (h1), Beschreibung,
 * rechts Aktionen oder Filter. Slots: `above` (z.B. Zurück-Link), `below` (zusätzliche Angaben), Standard = rechts.
 */
defineProps<{ title: string, eyebrow?: string | null, description?: string | null }>()
</script>

<template>
  <header class="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
    <div class="min-w-0 max-w-3xl">
      <slot name="above" />
      <p v-if="eyebrow" class="label-caps text-accent">{{ eyebrow }}</p>
      <h1 class="mt-1 text-4xl text-balance sm:text-5xl">{{ title }}</h1>
      <p v-if="description" class="mt-2 text-fg-muted">{{ description }}</p>
      <slot name="below" />
    </div>
    <div v-if="$slots.default" class="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:min-w-72 sm:justify-end">
      <slot />
    </div>
  </header>
</template>

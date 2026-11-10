<script setup lang="ts">
/**
 * Kartenbild im Kartenformat 63 × 88 mm (oder eigene Quelle); ohne Bild wird der Name als Platzhalter gezeigt.
 * Bilder liefert der Shop unter /img/<printingId> bzw. /media/<id>; im CMS steht davor public.shopUrl.
 */
defineProps<{
  printingId?: string | null
  /** Eigene Bildquelle statt /img/<printingId>, z.B. Sealed-Produkte (/media/<id>) */
  src?: string | null
  alt: string
  eager?: boolean
}>()
const base = (useRuntimeConfig().public as { shopUrl?: string }).shopUrl ?? ''
</script>

<template>
  <div class="relative aspect-[63/88] overflow-hidden rounded-[4.5%] bg-surface-muted">
    <img
      v-if="src || printingId"
      :src="src ? (src.startsWith('/') ? `${base}${src}` : src) : `${base}/img/${printingId}`"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      class="h-full w-full object-cover"
    >
    <div v-else class="flex h-full items-center justify-center p-3 text-center font-display text-small text-fg-subtle">
      {{ alt }}
    </div>
  </div>
</template>

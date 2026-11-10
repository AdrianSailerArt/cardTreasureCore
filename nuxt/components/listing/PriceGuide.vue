<script setup lang="ts">
/** Preis-Orientierung beim Anlegen/Bearbeiten: Richtpreis, Trend und günstigstes Angebot anderer Verkäufer; Klick übernimmt. */
const props = defineProps<{
  referenceCents: number | null
  referenceCurrency?: string | null
  trendCents?: number | null
  marketFromCents: number | null
  /** Sealed-Produkt statt Kartendruck (nur für den Hinweis ohne Preisdaten) */
  sealed?: boolean
}>()
defineEmits<{ use: [cents: number] }>()
const text = useListingText()
const { price } = useUiFormat()

const entries = computed(() => [
  { label: text.value.guideReference, cents: props.referenceCents, currency: props.referenceCurrency ?? 'EUR' },
  { label: text.value.guideTrend, cents: props.trendCents ?? null, currency: 'EUR' },
  { label: text.value.guideMarketFrom, cents: props.marketFromCents, currency: 'EUR' },
].filter(e => e.cents !== null) as { label: string, cents: number, currency: string }[])
</script>

<template>
  <div v-if="entries.length" class="flex flex-wrap gap-2 text-meta">
    <button
      v-for="e in entries"
      :key="e.label"
      type="button"
      class="min-h-8 rounded-md bg-surface-muted px-3 text-fg-muted transition hover:text-accent"
      :title="text.usePrice"
      @click="$emit('use', e.currency === 'USD' ? Math.round(e.cents * 0.92) : e.cents)"
    >
      {{ e.label }}: <span class="tabular-nums text-fg">{{ price(e.cents, e.currency) }}</span>
    </button>
  </div>
  <p v-else class="text-meta text-fg-subtle">{{ sealed ? text.guideNoneSealed : text.guideNone }}</p>
</template>

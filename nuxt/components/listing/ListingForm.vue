<script setup lang="ts">
/**
 * Formular für ein Angebot (Shop und CMS). Beim Anlegen mit Variante und 1. Edition, beim Bearbeiten ohne
 * (die hängen am Druck und lassen sich nachträglich nicht ändern). Für Sealed nur Menge, Preis, Kommentar, Lagerplatz.
 */
export type ListingValues = {
  condition: string
  language: string
  finish: string
  isFirstEdition: boolean
  quantity: number
  priceCents: number | null
  comment: string
  /** Lagerplatz, nur für den Anbieter sichtbar */
  storageLocation?: string
}

const props = withDefaults(defineProps<{
  mode: 'create' | 'edit'
  finishes?: string[]
  /** Sprachen, in denen der Druck laut Katalog existiert (werden oben einsortiert) */
  printedLanguages?: string[]
  hasFirstEdition?: boolean
  busy?: boolean
  /** Sealed-Produkt: ohne Zustand, Sprache und Variante (stehen am Produkt) */
  sealed?: boolean
  /** Ab diesem Preis Hinweis auf ein echtes Foto (Shop); leer = kein Hinweis */
  photoHintFromCents?: number | null
}>(), { finishes: () => ['normal'], printedLanguages: () => [], hasFirstEdition: false, busy: false, sealed: false, photoHintFromCents: null })

const values = defineModel<ListingValues>({ required: true })
defineEmits<{ submit: [] }>()
defineSlots<{ guide?: () => unknown, actions?: () => unknown }>()

const text = useListingText()
const locale = useUiLocale()
const languageOptions = computed(() => {
  const printed = CARD_LANGUAGES.filter(l => props.printedLanguages.includes(l))
  const others = CARD_LANGUAGES.filter(l => !props.printedLanguages.includes(l))
  return [...printed, ...others].map(l => ({ value: l as string, label: languageLabel(l, locale.value) }))
})
const finishOptions = computed(() => props.finishes.map(f => ({ value: f, label: finishLabel(f, locale.value) })))
const valid = computed(() => values.value.priceCents !== null && values.value.priceCents >= 10 && values.value.quantity >= 1)
</script>

<template>
  <form class="space-y-5" @submit.prevent="valid && $emit('submit')">
    <div v-if="!sealed">
      <p class="mb-1 text-label text-fg-subtle">{{ text.condition }}</p>
      <ListingConditionPicker v-model="values.condition" />
    </div>

    <div v-if="!sealed" class="grid gap-4 sm:grid-cols-2">
      <UiField :label="text.language">
        <UiSelect v-model="values.language" :options="languageOptions" />
      </UiField>
      <UiField v-if="mode === 'create'" :label="text.finish">
        <UiSelect v-model="values.finish" :options="finishOptions" />
      </UiField>
    </div>

    <label v-if="!sealed && mode === 'create' && hasFirstEdition" class="flex items-center gap-2 text-small">
      <input v-model="values.isFirstEdition" type="checkbox" class="accent-accent">
      {{ finishLabel('firstEdition', locale) }}
    </label>

    <div class="grid gap-4 sm:grid-cols-2">
      <UiField :label="text.quantity">
        <input v-model.number="values.quantity" type="number" min="1" max="999" class="min-h-10 w-full rounded-md border border-line-strong bg-bg px-3 py-2 text-right text-small tabular-nums focus:border-accent">
      </UiField>
      <UiField :label="text.price">
        <ListingPriceInput v-model="values.priceCents" />
      </UiField>
    </div>
    <slot name="guide" />
    <p v-if="mode === 'create' && photoHintFromCents !== null && (values.priceCents ?? 0) >= photoHintFromCents" class="text-meta text-warning">{{ text.photoHint }}</p>

    <UiField :label="text.comment" :hint="text.commentHint">
      <UiInput v-model="values.comment" :placeholder="sealed ? text.commentPlaceholderSealed : text.commentPlaceholder" />
    </UiField>
    <UiField :label="text.storage" :hint="text.storageHint">
      <UiInput v-model="values.storageLocation" :placeholder="text.storagePlaceholder" />
    </UiField>

    <div class="flex flex-wrap items-center gap-3">
      <UiButton type="submit" :disabled="busy || !valid">{{ mode === 'create' ? text.create : text.save }}</UiButton>
      <slot name="actions" />
    </div>
  </form>
</template>

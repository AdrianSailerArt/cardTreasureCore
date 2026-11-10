<script setup lang="ts">
import type { Game, Price } from '@cardtreasure/core/catalog'
import type { CardHit } from './CardPicker.vue'
import type { ListingValues } from './ListingForm.vue'
import type { PickablePrinting } from './PrintingPicker.vue'
import type { SealedHit } from './SealedPicker.vue'

/** Karte mit Drucken, wie sie die App für Schritt 2 und 3 lädt (Shop: /api/catalog/<game>/cards/<slug>). */
export interface CreatorCard {
  card: { name: string, translations: { language: string, name: string }[] }
  printings: (PickablePrinting & { languages: string[], hasFirstEdition: boolean, trendCents: number | null, prices: Price[] })[]
}
/** Was beim Anlegen an die App geht */
export type CreatorInput = Omit<ListingValues, 'comment' | 'storageLocation'> & { printingId: string, comment: string | null, storageLocation: string | null }
/** Sealed: Zustand, Sprache und Variante stehen am Produkt */
export interface CreatorSealedInput { productId: string, quantity: number, priceCents: number | null, comment: string | null, storageLocation: string | null }

/**
 * Angebot anlegen, gleich in Shop (Kunden) und CMS (Angebote von CardTreasure):
 *   Einzelkarte: 1. Karte suchen, 2. Druck wählen, 3. Zustand, Sprache, Variante, Menge, Preis (mit Orientierung), Kommentar, Lagerplatz.
 *   Sealed (wenn `searchSealed` übergeben): 1. Produkt suchen, 2. Menge, Preis, Kommentar, Lagerplatz.
 * Suchen, Laden und Speichern übergibt die App; nach dem Anlegen bleibt die Karte gewählt, damit man weitere einstellen kann.
 */
const props = withDefaults(defineProps<{
  search: (q: string, game?: Game) => Promise<CardHit[]>
  loadCard: (game: Game, slug: string) => Promise<CreatorCard>
  create: (input: CreatorInput | CreatorSealedInput) => Promise<{ id: string }>
  /** Sealed-Suche; ohne sie gibt es nur Einzelkarten */
  searchSealed?: (q: string, game?: Game) => Promise<SealedHit[]>
  /** Vorauswahl, z.B. von der Kartenseite (?game=&card=&printing=) */
  initial?: { game: Game, slug: string, printingId?: string | null } | null
  /** Ab diesem Preis Hinweis auf ein echtes Foto; leer = kein Hinweis */
  photoHintFromCents?: number | null
}>(), { initial: null, photoHintFromCents: null, searchSealed: undefined })
const emit = defineEmits<{ created: [listing: { id: string, priceCents: number }] }>()
defineSlots<{
  /** Unter dem Formular nach dem Anlegen, z.B. Fotos hochladen */
  after?: (p: { listing: { id: string, priceCents: number } }) => unknown
  /** Zusätzliche Knöpfe neben „Angebot einstellen“, z.B. „Fertig“ */
  actions?: () => unknown
}>()

const text = useListingText()
const locale = useUiLocale()

const kind = ref<'single' | 'sealed'>('single')
const kindOptions = computed(() => [{ value: 'single' as const, label: text.value.kindSingle }, { value: 'sealed' as const, label: text.value.kindSealed }])
const sealed = ref<SealedHit | null>(null)
const localName = useLocalName()

const picked = ref<{ game: Game, slug: string } | null>(props.initial ? { game: props.initial.game, slug: props.initial.slug } : null)
const card = ref<CreatorCard | null>(null)
const printingId = ref<string | null>(props.initial?.printingId ?? null)
const loadError = ref(false)

const load = async () => {
  card.value = null
  loadError.value = false
  if (!picked.value) return
  try {
    card.value = await props.loadCard(picked.value.game, picked.value.slug)
    if (card.value.printings.length === 1) printingId.value = card.value.printings[0]!.id
  }
  catch {
    loadError.value = true
  }
}
watch(picked, load, { immediate: true })

const printing = computed(() => card.value?.printings.find(p => p.id === printingId.value) ?? null)
const cardName = computed(() => card.value?.card.translations.find(x => x.language === locale.value)?.name ?? card.value?.card.name ?? '')

const pickCard = (game: Game, slug: string) => {
  picked.value = { game, slug }
  printingId.value = null
}

const values = ref<ListingValues>({
  condition: 'near_mint', language: locale.value, finish: 'normal', isFirstEdition: false, quantity: 1, priceCents: null, comment: '', storageLocation: '',
})
watch(printing, (p) => {
  if (!p) return
  values.value.finish = p.finishes[0] ?? 'normal'
  if (!p.languages.includes(values.value.language) && p.languages[0]) values.value.language = p.languages[0]
})
const reference = computed(() => {
  const p = printing.value
  if (!p) return null
  return [...p.prices].sort((a, b) => Number(b.finish === values.value.finish) - Number(a.finish === values.value.finish))[0] ?? null
})

const busy = ref(false)
const error = ref<string | null>(null)
const created = ref(0)
const last = ref<{ id: string, priceCents: number } | null>(null)
const pickSealed = (hit: SealedHit) => {
  sealed.value = hit
  created.value = 0
  last.value = null
}
const submit = async () => {
  if (kind.value === 'single' ? !printing.value : !sealed.value) return
  busy.value = true
  error.value = null
  try {
    const extra = { comment: values.value.comment || null, storageLocation: values.value.storageLocation || null }
    const res = await props.create(kind.value === 'sealed'
      ? { productId: sealed.value!.productId, quantity: values.value.quantity, priceCents: values.value.priceCents, ...extra }
      : { ...values.value, printingId: printing.value!.id, ...extra })
    last.value = { id: res.id, priceCents: values.value.priceCents ?? 0 }
    created.value++
    emit('created', last.value)
    values.value.quantity = 1
    values.value.comment = ''
  }
  catch (e) {
    const err = e as { data?: { statusMessage?: string, message?: string } }
    error.value = err.data?.statusMessage ?? err.data?.message ?? text.value.error
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <div>
    <div v-if="searchSealed && !picked && !sealed" class="mb-4 flex flex-wrap items-center gap-3">
      <span class="text-label text-fg-subtle">{{ text.kind }}</span>
      <UiSegmented v-model="kind" :options="kindOptions" :label="text.kind" />
    </div>

    <template v-if="kind === 'sealed'">
      <Panel v-if="!sealed" :title="text.sealedStep1">
        <ListingSealedPicker :search="searchSealed!" @pick="pickSealed" />
      </Panel>
      <Panel v-else :title="`${text.sealedStep2}: ${localName(sealed.name, sealed.nameDe)}`">
        <template #actions>
          <button type="button" class="min-h-8 text-small text-accent hover:underline" @click="sealed = null">{{ text.otherProduct }}</button>
        </template>
        <div class="grid gap-6 md:grid-cols-[160px_1fr]">
          <div class="mx-auto w-40">
            <CardImage :src="sealed.imageId ? `/media/${sealed.imageId}` : null" :alt="sealed.name" />
            <p class="mt-2 text-center text-meta text-fg-subtle">{{ gameLabel(sealed.game) }} · {{ sealedTypeLabel(sealed.type, locale) }}</p>
          </div>
          <ListingForm v-model="values" mode="create" sealed :photo-hint-from-cents="photoHintFromCents" :busy="busy" @submit="submit">
            <template #guide>
              <ListingPriceGuide :reference-cents="null" :market-from-cents="sealed.fromCents" sealed @use="cents => values.priceCents = cents" />
            </template>
            <template #actions><slot name="actions" /></template>
          </ListingForm>
        </div>
        <UiNotice v-if="created" tone="success" class="mt-4">{{ text.created(created) }}</UiNotice>
        <slot v-if="last" name="after" :listing="last" />
        <UiNotice v-if="error" tone="danger" class="mt-4">{{ error }}</UiNotice>
      </Panel>
    </template>

    <Panel v-else-if="!picked" :title="text.step1">
      <ListingCardPicker :search="search" @pick="pickCard" />
    </Panel>

    <UiNotice v-else-if="loadError" tone="danger">
      {{ text.error }}
      <button type="button" class="ml-2 text-accent hover:underline" @click="picked = null">{{ text.otherCard }}</button>
    </UiNotice>

    <template v-else-if="card">
      <Panel :title="`${text.step2}: ${cardName}`">
        <template #actions>
          <button type="button" class="min-h-8 text-small text-accent hover:underline" @click="picked = null">{{ text.otherCard }}</button>
        </template>
        <ListingPrintingPicker :printings="card.printings" :selected-id="printingId" @pick="id => printingId = id" />
      </Panel>

      <Panel v-if="printing" :title="text.step3" class="mt-6">
        <div class="grid gap-6 md:grid-cols-[160px_1fr]">
          <CardImage :printing-id="printing.hasImage ? printing.id : null" :alt="cardName" class="mx-auto w-40" />
          <ListingForm
            v-model="values"
            mode="create"
            :finishes="printing.finishes.length ? printing.finishes : ['normal']"
            :printed-languages="printing.languages"
            :has-first-edition="printing.hasFirstEdition"
            :photo-hint-from-cents="photoHintFromCents"
            :busy="busy"
            @submit="submit"
          >
            <template #guide>
              <ListingPriceGuide
                :reference-cents="reference ? headlinePrice(reference) : null"
                :reference-currency="reference?.currency"
                :trend-cents="printing.trendCents"
                :market-from-cents="printing.fromCents"
                @use="cents => values.priceCents = cents"
              />
            </template>
            <template #actions><slot name="actions" /></template>
          </ListingForm>
        </div>
        <UiNotice v-if="created" tone="success" class="mt-4">{{ text.created(created) }}</UiNotice>
        <slot v-if="last" name="after" :listing="last" />
        <UiNotice v-if="error" tone="danger" class="mt-4">{{ error }}</UiNotice>
      </Panel>
    </template>
    <p v-else class="text-small text-fg-subtle" aria-live="polite">{{ text.loading }}</p>
  </div>
</template>

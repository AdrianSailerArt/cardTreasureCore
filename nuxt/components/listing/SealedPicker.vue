<script setup lang="ts">
import type { Game } from '@cardtreasure/core/catalog'

/** Treffer der Sealed-Suche (Booster, Display, Deck …) */
export type SealedHit = {
  productId: string, game: Game, slug: string, type: string, name: string, nameDe: string | null
  setName: string | null, setNameDe: string | null, imageId: string | null, fromCents: number | null
}

/** Sealed-Produkt suchen, optional nach Spiel gefiltert (gleich aufgebaut wie die Kartensuche). Die Suche übergibt die App. */
const props = defineProps<{ search: (q: string, game?: Game) => Promise<SealedHit[]> }>()
const emit = defineEmits<{ pick: [hit: SealedHit] }>()
const text = useListingText()
const locale = useUiLocale()
const localName = useLocalName()
const { price } = useUiFormat()

const query = ref('')
const game = ref<Game | undefined>()
const results = ref<SealedHit[]>([])
const loading = ref(false)
const failed = ref(false)

const run = async () => {
  failed.value = false
  if (query.value.trim().length < 2) {
    results.value = []
    return
  }
  loading.value = true
  try {
    results.value = await props.search(query.value.trim(), game.value)
  }
  catch {
    failed.value = true
    results.value = []
  }
  finally {
    loading.value = false
  }
}
useDebounced(() => [query.value, game.value], 250, run)
</script>

<template>
  <div>
    <UiSearchField v-model="query" :placeholder="text.searchSealed" size="lg" autofocus />
    <div class="mt-3 flex flex-wrap gap-2">
      <UiChip :active="!game" @click="game = undefined">{{ text.allGames }}</UiChip>
      <UiChip v-for="g in GAMES" :key="g" :active="game === g" @click="game = g">{{ gameLabel(g) }}</UiChip>
    </div>

    <p class="sr-only" aria-live="polite">{{ loading ? text.searching : query.trim().length >= 2 ? `${results.length}` : '' }}</p>
    <UiNotice v-if="failed" tone="danger" class="mt-6">{{ text.error }}</UiNotice>
    <p v-else-if="query.trim().length >= 2 && !loading && !results.length" class="mt-6 text-small text-fg-muted">{{ text.noResults }}</p>
    <ul class="mt-6 grid gap-2 sm:grid-cols-2 [&>li]:min-w-0">
      <li v-for="r in results" :key="r.productId">
        <button type="button" class="flex w-full items-center gap-3 rounded-lg border border-line p-2 text-left transition hover:border-accent" @click="emit('pick', r)">
          <CardImage :src="r.imageId ? `/media/${r.imageId}?size=thumb` : null" :alt="r.name" class="w-12 shrink-0" />
          <span class="min-w-0">
            <span class="block truncate">{{ localName(r.name, r.nameDe) }}</span>
            <span class="block truncate text-meta text-fg-subtle">
              {{ gameLabel(r.game) }} · {{ sealedTypeLabel(r.type, locale) }}<template v-if="r.setName"> · {{ localName(r.setName, r.setNameDe) }}</template>
              · {{ r.fromCents !== null ? `${text.from} ${price(r.fromCents)}` : text.noOffersYet }}
            </span>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

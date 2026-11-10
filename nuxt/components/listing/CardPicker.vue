<script setup lang="ts">
import type { Game } from '@cardtreasure/core/catalog'

/** Treffer der Kartensuche */
export type CardHit = { game: Game, slug: string, name: string, nameDe: string | null, imagePrintingId: string | null, setName: string | null, printingCount: number }

/** Schritt 1 beim Anlegen: Karte suchen (deutsch oder englisch), optional nach Spiel gefiltert. Die Suche übergibt die App. */
const props = defineProps<{ search: (q: string, game?: Game) => Promise<CardHit[]> }>()
const emit = defineEmits<{ pick: [game: Game, slug: string] }>()
const text = useListingText()
const localName = useLocalName()

const query = ref('')
const game = ref<Game | undefined>()
const results = ref<CardHit[]>([])
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
    <UiSearchField v-model="query" :placeholder="text.search" size="lg" autofocus />
    <div class="mt-3 flex flex-wrap gap-2">
      <UiChip :active="!game" @click="game = undefined">{{ text.allGames }}</UiChip>
      <UiChip v-for="g in GAMES" :key="g" :active="game === g" @click="game = g">{{ gameLabel(g) }}</UiChip>
    </div>

    <p class="sr-only" aria-live="polite">{{ loading ? text.searching : query.trim().length >= 2 ? `${results.length}` : '' }}</p>
    <UiNotice v-if="failed" tone="danger" class="mt-6">{{ text.error }}</UiNotice>
    <p v-else-if="query.trim().length >= 2 && !loading && !results.length" class="mt-6 text-small text-fg-muted">{{ text.noResults }}</p>
    <ul class="mt-6 grid gap-2 sm:grid-cols-2 [&>li]:min-w-0">
      <li v-for="r in results" :key="`${r.game}-${r.slug}`">
        <button type="button" class="flex w-full items-center gap-3 rounded-lg border border-line p-2 text-left transition hover:border-accent" @click="emit('pick', r.game, r.slug)">
          <CardImage :printing-id="r.imagePrintingId" :alt="r.name" class="w-12 shrink-0" />
          <span class="min-w-0">
            <span class="block truncate">{{ localName(r.name, r.nameDe) }}</span>
            <span class="block truncate text-meta text-fg-subtle">{{ gameLabel(r.game) }} · {{ r.setName }} · {{ text.printingCount(r.printingCount) }}</span>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
/** Schritt 2 beim Anlegen: den konkreten Druck (Set, Nummer, Seltenheit) wählen. */
export interface PickablePrinting {
  id: string
  collectorNumber: string | null
  rarity: string | null
  finishes: string[]
  hasImage: boolean
  setName: string
  setNameDe: string | null
  setCode: string
  releaseDate: string | null
  fromCents: number | null
}

defineProps<{ printings: PickablePrinting[], selectedId: string | null }>()
const emit = defineEmits<{ pick: [id: string] }>()
const text = useListingText()
const localName = useLocalName()
const { price } = useUiFormat()
</script>

<template>
  <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 [&>li]:min-w-0" role="radiogroup">
    <li v-for="p in printings" :key="p.id">
      <button
        type="button"
        role="radio"
        :aria-checked="p.id === selectedId"
        class="block w-full rounded-lg border p-2 text-left transition"
        :class="p.id === selectedId ? 'border-accent bg-accent-soft' : 'border-line hover:border-accent'"
        @click="emit('pick', p.id)"
      >
        <CardImage :printing-id="p.hasImage ? p.id : null" :alt="localName(p.setName, p.setNameDe)" />
        <span class="mt-2 block truncate text-small">{{ localName(p.setName, p.setNameDe) }}</span>
        <span class="block truncate text-meta text-fg-subtle">{{ p.setCode }} · {{ p.collectorNumber }} · {{ p.rarity }}</span>
        <span class="block text-meta text-fg-muted">{{ p.fromCents !== null ? `${text.from} ${price(p.fromCents)}` : text.noOffersYet }}</span>
      </button>
    </li>
  </ul>
</template>

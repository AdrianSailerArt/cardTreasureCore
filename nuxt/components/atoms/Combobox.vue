<script setup lang="ts">
/**
 * Suchfeld mit Vorschlagsliste (Kunde, Set, Karte wählen …), barrierefrei nach dem ARIA-Combobox-Muster:
 * Pfeiltasten wählen, Enter übernimmt, Esc schließt; Screenreader hören Anzahl und aktive Option.
 * Die Suche selbst macht die aufrufende Komponente (v-model:query, Treffer als `items`).
 * Klick auf einen Treffer mit preventDefault: steckt die Combobox in einem <label> (UiField), würde der Browser den Klick
 * sonst an das erste Bedienelement im Label weitergeben, z.B. einen Knopf, der nach der Auswahl erscheint.
 */
export type ComboboxItem = { value: string, label: string, hint?: string | null }

const props = withDefaults(defineProps<{
  items: ComboboxItem[]
  /** Beschriftung für Screenreader (sichtbares Label kommt meist von UiField) */
  label: string
  placeholder?: string
  /** Breite der Liste, falls breiter als das Feld (z.B. 'w-80') */
  listClass?: string
}>(), { placeholder: '', listClass: 'w-full' })
const query = defineModel<string>('query', { default: '' })
const emit = defineEmits<{ select: [item: ComboboxItem] }>()

const id = useId()
const locale = useUiLocale()
const active = ref(-1)
const open = ref(false)
const expanded = computed(() => open.value && props.items.length > 0)
watch(() => props.items, () => {
  active.value = props.items.length ? 0 : -1
  open.value = true
})

const choose = (item: ComboboxItem | undefined) => {
  if (!item) return
  emit('select', item)
  open.value = false
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); open.value = true; active.value = Math.min(props.items.length - 1, active.value + 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); active.value = Math.max(0, active.value - 1) }
  else if (e.key === 'Enter' && expanded.value) { e.preventDefault(); choose(props.items[active.value]) }
  else if (e.key === 'Escape') { open.value = false }
}
</script>

<template>
  <div class="relative">
    <input
      v-model="query"
      type="search"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      :aria-label="label"
      :aria-expanded="expanded ? 'true' : 'false'"
      :aria-controls="`${id}-list`"
      :aria-activedescendant="expanded && active >= 0 ? `${id}-opt-${active}` : undefined"
      :placeholder="placeholder"
      class="min-h-10 w-full rounded-md border border-line-strong bg-bg px-3 py-2 text-small text-fg placeholder:text-fg-subtle focus:border-accent"
      @keydown="onKey"
      @focus="open = true"
      @blur="open = false"
    >
    <ul
      v-show="expanded"
      :id="`${id}-list`"
      role="listbox"
      class="absolute right-0 z-20 mt-1 max-h-72 overflow-auto rounded-md border border-line bg-surface py-1 text-small shadow-lg"
      :class="listClass"
    >
      <li
        v-for="(item, i) in items"
        :id="`${id}-opt-${i}`"
        :key="item.value"
        role="option"
        :aria-selected="i === active ? 'true' : 'false'"
        class="cursor-pointer px-3 py-2"
        :class="i === active ? 'bg-surface-muted text-accent' : ''"
        @mousedown.prevent
        @mouseenter="active = i"
        @click.prevent="choose(item)"
      >
        {{ item.label }}
        <span v-if="item.hint" class="block text-meta text-fg-subtle">{{ item.hint }}</span>
      </li>
    </ul>
    <p class="sr-only" aria-live="polite">{{ expanded ? `${items.length} ${locale === 'en' ? 'results' : 'Treffer'}` : '' }}</p>
  </div>
</template>

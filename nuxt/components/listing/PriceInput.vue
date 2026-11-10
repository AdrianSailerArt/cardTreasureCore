<script setup lang="ts">
/** Preisfeld in Euro; das Modell ist in Cent. Zeigt Fehler unter dem Mindestpreis (am Feld, angesagt). */
const model = defineModel<number | null>({ required: true })
const props = withDefaults(defineProps<{ minCents?: number, placeholder?: string, label?: string }>(), { minCents: 10 })
const text = useListingText()
const locale = useUiLocale()

const format = (cents: number | null) =>
  cents === null ? '' : new Intl.NumberFormat(locale.value === 'de' ? 'de-DE' : 'en-GB', { minimumFractionDigits: 2 }).format(cents / 100)

const value = ref(format(model.value))
watch(model, (v) => {
  if (parseEuro(value.value) !== v) value.value = format(v)
})

const onInput = () => {
  model.value = parseEuro(value.value)
}
const error = computed(() => {
  if (!value.value) return null
  if (model.value === null) return text.value.priceInvalid
  if (model.value < props.minCents) return text.value.priceMin
  return null
})
const errorId = useId()
</script>

<template>
  <div>
    <div class="flex min-h-10 items-center rounded-md border bg-bg focus-within:border-accent focus-within:outline-2 focus-within:outline-accent" :class="error ? 'border-danger' : 'border-line-strong'">
      <input v-model="value" inputmode="decimal" :placeholder="placeholder" :aria-label="label" class="w-full bg-transparent px-3 py-2 text-right text-small tabular-nums text-fg focus-visible:outline-none" :aria-invalid="error ? 'true' : undefined" :aria-describedby="error ? errorId : undefined" @input="onInput" @blur="value = format(model)">
      <span class="pr-3 text-small text-fg-subtle">€</span>
    </div>
    <p v-if="error" :id="errorId" class="mt-1 text-meta text-danger" role="alert">{{ error }}</p>
  </div>
</template>

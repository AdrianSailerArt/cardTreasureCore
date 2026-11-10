<script setup lang="ts">
/** Auswahl des Zustands als Ampel-Tags (Mint grün … Poor rot). */
const model = defineModel<string>({ required: true })
const text = useListingText()
</script>

<template>
  <div class="flex flex-wrap gap-2" role="radiogroup" :aria-label="text.condition">
    <button
      v-for="c in CONDITION_ORDER"
      :key="c"
      type="button"
      role="radio"
      :aria-checked="model === c"
      class="rounded-md p-0.5 outline-offset-2 transition"
      :class="model === c ? 'ring-2 ring-accent' : 'opacity-60 hover:opacity-100'"
      @click="model = c"
    >
      <ConditionBadge :condition="c" long />
    </button>
  </div>
</template>

<script setup lang="ts">
/** Abgerundetes Such- bzw. Filterfeld; `label` für Screenreader, wenn kein sichtbares Label daneben steht. */
withDefaults(defineProps<{
  placeholder: string
  label?: string
  size?: 'sm' | 'lg'
  autofocus?: boolean
}>(), { size: 'sm', autofocus: false })

const model = defineModel<string>({ default: '' })
</script>

<template>
  <input
    v-model="model"
    type="search"
    :placeholder="placeholder"
    :aria-label="label ?? placeholder"
    :autofocus="autofocus"
    class="w-full rounded-md border border-line-strong bg-surface text-fg placeholder:text-fg-subtle focus:border-accent"
    :class="size === 'lg' ? 'min-h-12 px-5 py-3' : 'min-h-10 px-4 py-2 text-small'"
  >
</template>

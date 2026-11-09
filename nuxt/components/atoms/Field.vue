<script setup lang="ts">
/** Beschriftetes Formularfeld: Label, Inhalt (Input/Select/Textarea) und optionaler Hinweis. */
defineProps<{ label: string, hint?: string }>()
</script>

<template>
  <label class="block">
    <span class="mb-1 block text-label text-fg-subtle">{{ label }}</span>
    <slot />
    <span v-if="hint" class="mt-1 block text-meta text-fg-subtle">{{ hint }}</span>
  </label>
</template>

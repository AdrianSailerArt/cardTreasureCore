<script setup lang="ts">
/** Brotkrumen-Navigation; der letzte Eintrag ohne Link ist die aktuelle Seite. */
defineProps<{ items: { label: string, to?: string }[] }>()
const locale = useUiLocale()
</script>

<template>
  <nav class="mb-6" :aria-label="locale === 'en' ? 'Breadcrumb' : 'Navigationspfad'">
    <ol class="flex flex-wrap items-center gap-x-2 text-small text-fg-subtle">
      <li v-for="(item, i) in items" :key="i" class="flex items-center gap-x-2">
        <span v-if="i > 0" aria-hidden="true">/</span>
        <NuxtLink v-if="item.to" :to="item.to" class="hover:text-accent">{{ item.label }}</NuxtLink>
        <span v-else class="text-fg-muted" aria-current="page">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
/** Zustand (Bestellung, Sendung, Angebot, Beitrag, Import, Meldung) als Ampel-Tag; Farbe und Text aus dem gemeinsamen Wortschatz. */
const props = defineProps<{ status: string, label?: string }>()
const f = useUiFormat()
</script>

<template>
  <Tag :tone="f.statusTone(status)">{{ props.label ?? f.status(status) }}</Tag>
</template>

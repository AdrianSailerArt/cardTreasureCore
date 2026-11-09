<script setup lang="ts">
/**
 * Kennzahl für alle Bereiche: Bezeichnung (Versalien) und Wert, optional Veränderung (Ampel) und Rahmen.
 * `sm` in Listen, `md` Standard, `lg` für Hauptzahlen. `framed` als eigene Kachel (z.B. Auswertungen).
 */
withDefaults(defineProps<{
  label: string
  value: string | number
  size?: 'sm' | 'md' | 'lg'
  framed?: boolean
  /** Veränderung zum Vorzeitraum; `up` färbt grün, sonst rot (zusätzlich Pfeil, nicht nur Farbe) */
  change?: { text: string, up: boolean } | null
  hint?: string | null
}>(), { size: 'md', framed: false })
const SIZE = { sm: 'text-base font-medium', md: 'text-xl font-semibold', lg: 'font-display text-3xl' }
</script>

<template>
  <dl :class="framed ? 'rounded-lg border border-line bg-surface p-5' : ''">
    <dt class="label-caps text-fg-subtle">{{ label }}</dt>
    <dd class="mt-1 tabular-nums" :class="SIZE[size]">{{ value }}</dd>
    <dd v-if="change" class="mt-1 text-xs font-medium" :class="change.up ? 'text-success' : 'text-danger'">
      <span aria-hidden="true">{{ change.up ? '▲' : '▼' }}</span> {{ change.text }}
    </dd>
    <dd v-if="hint" class="mt-1 text-xs text-fg-subtle">{{ hint }}</dd>
  </dl>
</template>

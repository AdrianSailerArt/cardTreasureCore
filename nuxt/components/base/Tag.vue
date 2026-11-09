<script setup lang="ts">
/**
 * Kleines Etikett mit Farbton aus dem Color-Set.
 * Allgemeine Töne (neutral, accent, success …) und Ampel-Töne für Kartenzustände (mint … poor).
 */
export type TagTone =
  | 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'foil'
  | 'mint' | 'near_mint' | 'excellent' | 'good' | 'light_played' | 'played' | 'poor'

withDefaults(defineProps<{
  tone?: TagTone
  /** Großbuchstaben mit Laufweite, z.B. für Kürzel */
  caps?: boolean
  title?: string
}>(), { tone: 'neutral', caps: false })

// Vollständige Klassen, damit Tailwind sie findet
const TONES: Record<TagTone, string> = {
  neutral: 'bg-surface-muted text-fg-muted',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  foil: 'bg-gradient-to-r from-foil-from to-foil-to text-fg',
  mint: 'bg-cond-mint/15 text-cond-mint',
  near_mint: 'bg-cond-near-mint/15 text-cond-near-mint',
  excellent: 'bg-cond-excellent/15 text-cond-excellent',
  good: 'bg-cond-good/15 text-cond-good',
  light_played: 'bg-cond-light-played/15 text-cond-light-played',
  played: 'bg-cond-played/15 text-cond-played',
  poor: 'bg-cond-poor/15 text-cond-poor',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-1.5 py-1 text-[11px] font-semibold leading-none"
    :class="[TONES[tone], { 'uppercase tracking-[0.08em]': caps }]"
    :title="title"
  >
    <slot />
  </span>
</template>

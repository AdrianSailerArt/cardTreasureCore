<script setup lang="ts">
/**
 * Button oder Link. Kantige Form (knapper Radius), Beschriftung in Versalien mit Laufweite.
 * `primary` Hauptaktion, `ghost` alles andere (gefüllte Fläche), `soft` Bestätigung (z.B. „im Warenkorb“),
 * `danger` für Destruktives. Mindesthöhe 32/40/48 px für gut treffbare Klickflächen; Fokusring kommt global.
 */
withDefaults(defineProps<{
  variant?: 'primary' | 'ghost' | 'soft' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}>(), { variant: 'primary', size: 'md', type: 'button', disabled: false })

const BASE = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold uppercase tracking-[0.08em] transition'
const SIZES = { sm: 'min-h-8 px-3 text-[11px]', md: 'min-h-10 px-4 text-xs', lg: 'min-h-12 px-6 text-sm' }
const VARIANTS = {
  primary: 'bg-primary text-on-primary hover:opacity-90',
  ghost: 'bg-surface-muted text-fg hover:text-accent',
  soft: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger hover:bg-danger hover:text-on-primary',
}
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="[BASE, SIZES[size], VARIANTS[variant]]">
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="[BASE, SIZES[size], VARIANTS[variant], 'disabled:cursor-not-allowed disabled:opacity-50']"
  >
    <slot />
  </button>
</template>

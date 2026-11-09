/*
 * Nuxt-Layer mit gemeinsamen UI-Bausteinen für Shop und CMS. Einbinden in nuxt.config:  extends: ['@cardtreasure/core/nuxt']
 *   components/atoms  → UiTable (Präfix Ui, wie die Atoms der Apps)
 *   composables       → useDebounced, useChartTheme, chartBase
 * Fachmodule (Versand, Bilder …) werden direkt importiert:  import { quoteShipping } from '@cardtreasure/core/shipping'
 */
export default defineNuxtConfig({
  components: [{ path: './components/atoms', prefix: 'Ui' }],
  // Das Paket liefert TypeScript-Quellen; Vite und Nitro sollen es mitübersetzen statt als fertiges Modul behandeln
  build: { transpile: ['@cardtreasure/core'] },
  nitro: { externals: { inline: ['@cardtreasure/core'] } },
})

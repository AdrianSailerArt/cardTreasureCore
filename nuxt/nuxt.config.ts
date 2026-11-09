/*
 * Nuxt-Layer mit gemeinsamen UI-Bausteinen für Shop und CMS. Einbinden in nuxt.config:  extends: ['@cardtreasure/core/nuxt']
 *   components/atoms  → UiTable (Präfix Ui, wie die Atoms der Apps)
 *   composables       → useDebounced, useChartTheme, chartBase
 *   Auto-Imports      → Versand (quoteShipping, shippingTariff …) und slugify, in Vue und auf dem Server
 * Fachmodule (Versand, Bilder …) werden direkt importiert:  import { quoteShipping } from '@cardtreasure/core/shipping'
 */
// Diese Werte stehen in Vue und auf dem Server ohne Import zur Verfügung (wie vorher aus shared/utils)
const shipping = { from: '@cardtreasure/core/shipping', imports: ['SHIPPING_FORMATS', 'FORMAT_LIMITS', 'PACKING', 'estimatePackage', 'rejectReason', 'chooseShipping', 'EU_SHIPPING_COUNTRIES', 'shippingTariff', 'quoteShipping'] }
const slug = { from: '@cardtreasure/core/slug', imports: ['slugify'] }

export default defineNuxtConfig({
  imports: { presets: [shipping, slug] },
  components: [{ path: './components/atoms', prefix: 'Ui' }],
  // Das Paket liefert TypeScript-Quellen; Vite und Nitro sollen es mitübersetzen statt als fertiges Modul behandeln
  build: { transpile: ['@cardtreasure/core'] },
  nitro: { externals: { inline: ['@cardtreasure/core'] }, imports: { presets: [shipping, slug] } },
})

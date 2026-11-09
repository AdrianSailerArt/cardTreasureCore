/*
 * Nuxt-Layer mit gemeinsamen UI-Bausteinen für Shop und CMS. Einbinden in nuxt.config:  extends: ['@cardtreasure/core/nuxt']
 *   components/atoms  → UiButton, UiChip, UiField, UiInput, UiNotice, UiSegmented, UiSelect, UiTable (Präfix Ui)
 *   components/base   → Tag, Panel, PageHeader, Stat, StatusTag, EmptyState, CountryFlag, ChartFrame, Breadcrumbs, KeyValueList
 *   composables       → useUiLocale, useUiFormat (Formatierung und Status-Wortschatz in der aktuellen Sprache)
 *   assets/ui.css     → Color-Set, Formen, Fokus, label-caps; in der main.css der App importieren
 *   composables       → useDebounced, useChartTheme, chartBase
 *   Auto-Imports      → Versand (quoteShipping, shippingTariff …) und slugify, in Vue und auf dem Server
 * Fachmodule (Versand, Bilder …) werden direkt importiert:  import { quoteShipping } from '@cardtreasure/core/shipping'
 */
// Diese Werte stehen in Vue und auf dem Server ohne Import zur Verfügung (wie vorher aus shared/utils)
const shipping = { from: '@cardtreasure/core/shipping', imports: ['SHIPPING_FORMATS', 'FORMAT_LIMITS', 'PACKING', 'estimatePackage', 'rejectReason', 'chooseShipping', 'EU_SHIPPING_COUNTRIES', 'shippingTariff', 'quoteShipping'] }
const slug = { from: '@cardtreasure/core/slug', imports: ['slugify'] }
const ui = { from: '@cardtreasure/core/format', imports: ['formatPrice', 'formatNumber', 'formatDate', 'formatRate', 'countryName', 'intlLocale'] }
const status = { from: '@cardtreasure/core/status', imports: ['statusTone', 'statusLabel', 'STATUS_LABELS'] }

export default defineNuxtConfig({
  imports: { presets: [shipping, slug, ui, status] },
  components: [{ path: './components/atoms', prefix: 'Ui' }, { path: './components/base' }],
  // Fachmodule kommen fertig übersetzt aus dist/ (JavaScript + Typen), nur der Layer selbst ist Quelltext
  nitro: { imports: { presets: [shipping, slug, ui, status] } },
})

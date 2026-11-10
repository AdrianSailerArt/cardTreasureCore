/*
 * Nuxt-Layer mit gemeinsamen UI-Bausteinen für Shop und CMS. Einbinden in nuxt.config:  extends: ['@cardtreasure/core/nuxt']
 *   components/atoms  → UiButton, UiChip, UiCombobox, UiField, UiInput, UiNotice, UiSegmented, UiSelect, UiTable (Präfix Ui)
 *   components/base   → Tag, Panel, PageHeader, Stat, StatusTag, EmptyState, CountryFlag, ChartFrame, Breadcrumbs, KeyValueList
 *   components/listing → ListingCreator (ganzer Ablauf Karte → Druck → Angebot, oder Sealed → Angebot), ListingCardPicker, ListingSealedPicker, ListingPrintingPicker,
 *                       ListingForm, ListingConditionPicker, ListingPriceInput, ListingPriceGuide (gleich in Shop und CMS)
 *   composables       → useUiLocale, useUiFormat (Formatierung und Status-Wortschatz in der aktuellen Sprache)
 *   assets/ui.css     → Color-Set, Formen, Fokus, label-caps; in der main.css der App importieren
 *   composables       → useDebounced, useChartTheme, chartBase
 *   Auto-Imports      → Versand (quoteShipping, shippingTariff …), slugify, Format, Status, Katalog: in Vue (imports.presets) und auf dem Server (server/utils/core.ts)
 *   server/utils      → rows (SQL auf useDb() der App), localeParam/gameParam/flagParam (Query), useMediaStore/readUpload/runMediaAction (Bilder)
 *   plugins           → echarts.client (registriert die genutzten ECharts-Teile)
 * Fachmodule (Versand, Bilder …) werden direkt importiert:  import { quoteShipping } from '@cardtreasure/core/shipping'
 */
// Diese Werte stehen in Vue und auf dem Server ohne Import zur Verfügung (wie vorher aus shared/utils)
const shipping = { from: '@cardtreasure/core/shipping', imports: ['SHIPPING_FORMATS', 'FORMAT_LIMITS', 'PACKING', 'PACKAGING_COST', 'packagingCost', 'estimatePackage', 'rejectReason', 'chooseShipping', 'EU_SHIPPING_COUNTRIES', 'shippingTariff', 'quoteShipping'] }
const slug = { from: '@cardtreasure/core/slug', imports: ['slugify'] }
const ui = { from: '@cardtreasure/core/format', imports: ['formatPrice', 'formatNumber', 'formatDate', 'formatRate', 'countryName', 'intlLocale'] }
const status = { from: '@cardtreasure/core/status', imports: ['statusTone', 'statusLabel', 'STATUS_LABELS'] }
const catalog = { from: '@cardtreasure/core/catalog', imports: ['GAMES', 'isGame', 'CARD_LANGUAGES', 'CONDITION_ORDER', 'CONDITION_SHORT', 'parseEuro', 'headlinePrice', 'gameLabel', 'conditionLabel', 'languageLabel', 'finishLabel', 'sealedTypeLabel'] }

export default defineNuxtConfig({
  imports: { presets: [shipping, slug, ui, status, catalog] },
  components: [{ path: './components/atoms', prefix: 'Ui' }, { path: './components/base' }, { path: './components/listing', prefix: 'Listing' }],
  // Fachmodule kommen fertig übersetzt aus dist/ (JavaScript + Typen), nur der Layer selbst ist Quelltext.
  // Auf dem Server kommen dieselben Werte aus server/utils/core.ts (Re-Export, damit die Typen stimmen).
})

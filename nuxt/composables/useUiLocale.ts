import type { Ref } from 'vue'
import { countryName, formatDate, formatNumber, formatPrice, formatRate } from '@cardtreasure/core/format'
import { statusLabel, statusTone } from '@cardtreasure/core/status'

/** Sprache der Oberfläche: im Shop die gewählte (i18n), im CMS ohne i18n immer Deutsch. */
export const useUiLocale = () => {
  const i18n = (useNuxtApp() as unknown as { $i18n?: { locale: Ref<string> } }).$i18n
  return computed(() => (i18n?.locale.value === 'en' ? 'en' : 'de'))
}

/** Formatierer, an die aktuelle Sprache gebunden (gleiche Ausgabe in Shop und CMS). */
export const useUiFormat = () => {
  const locale = useUiLocale()
  return {
    locale,
    price: (cents: number | null | undefined, currency = 'EUR', digits?: number) => formatPrice(cents, locale.value, currency, digits),
    number: (n: number | null | undefined) => formatNumber(n, locale.value),
    date: (iso: string | Date | null | undefined, withTime = false) => formatDate(iso, locale.value, withTime),
    rate: (bps: number | null | undefined) => formatRate(bps, locale.value),
    country: (code: string) => countryName(code, locale.value),
    status: (status: string) => statusLabel(status, locale.value),
    statusTone,
  }
}

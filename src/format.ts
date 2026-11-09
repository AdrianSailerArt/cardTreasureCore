/*
 * Einheitliche Formatierung für Shop und CMS: Preise, Zahlen, Datum, Prozentsätze, Ländernamen.
 * Sprache als Parameter ('de' | 'en'); das CMS nutzt 'de', der Shop die gewählte Sprache.
 */
export type UiLocale = 'de' | 'en'

export const intlLocale = (locale: string) => (locale === 'en' ? 'en-GB' : 'de-DE')

/** Cent-Betrag als Währung, z.B. 1234 → „12,34 €“; `digits` für ganze Euro in Übersichten. */
export const formatPrice = (cents: number | null | undefined, locale: string = 'de', currency = 'EUR', digits?: number) =>
  cents === null || cents === undefined
    ? '–'
    : new Intl.NumberFormat(intlLocale(locale), {
      style: 'currency',
      currency,
      ...(digits === undefined ? {} : { minimumFractionDigits: digits, maximumFractionDigits: digits }),
    }).format(cents / 100)

export const formatNumber = (n: number | null | undefined, locale: string = 'de') =>
  n === null || n === undefined ? '–' : new Intl.NumberFormat(intlLocale(locale)).format(n)

/** Datum lesbar („9. Nov. 2026“), mit `withTime` auch Uhrzeit (kurz). */
export const formatDate = (iso: string | Date | null | undefined, locale: string = 'de', withTime = false) =>
  iso
    ? new Intl.DateTimeFormat(intlLocale(locale), withTime ? { dateStyle: 'short', timeStyle: 'short' } : { dateStyle: 'medium' }).format(new Date(iso))
    : '–'

/** Satz in Basispunkten als Prozent, z.B. 450 → „4,5 %“. */
export const formatRate = (bps: number | null | undefined, locale: string = 'de') =>
  bps === null || bps === undefined
    ? '–'
    : `${(bps / 100).toLocaleString(intlLocale(locale), { maximumFractionDigits: 2 })} %`

/** Ländername aus dem ISO-Code, z.B. „DE“ → „Deutschland“. */
export const countryName = (code: string, locale: string = 'de') => {
  try {
    return new Intl.DisplayNames([intlLocale(locale)], { type: 'region' }).of(code.toUpperCase()) ?? code
  }
  catch {
    return code
  }
}

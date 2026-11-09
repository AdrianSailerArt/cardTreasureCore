export const intlLocale = (locale) => (locale === 'en' ? 'en-GB' : 'de-DE');
/** Cent-Betrag als Währung, z.B. 1234 → „12,34 €“; `digits` für ganze Euro in Übersichten. */
export const formatPrice = (cents, locale = 'de', currency = 'EUR', digits) => cents === null || cents === undefined
    ? '–'
    : new Intl.NumberFormat(intlLocale(locale), {
        style: 'currency',
        currency,
        ...(digits === undefined ? {} : { minimumFractionDigits: digits, maximumFractionDigits: digits }),
    }).format(cents / 100);
export const formatNumber = (n, locale = 'de') => n === null || n === undefined ? '–' : new Intl.NumberFormat(intlLocale(locale)).format(n);
/** Datum lesbar („9. Nov. 2026“), mit `withTime` auch Uhrzeit (kurz). */
export const formatDate = (iso, locale = 'de', withTime = false) => iso
    ? new Intl.DateTimeFormat(intlLocale(locale), withTime ? { dateStyle: 'short', timeStyle: 'short' } : { dateStyle: 'medium' }).format(new Date(iso))
    : '–';
/** Satz in Basispunkten als Prozent, z.B. 450 → „4,5 %“. */
export const formatRate = (bps, locale = 'de') => bps === null || bps === undefined
    ? '–'
    : `${(bps / 100).toLocaleString(intlLocale(locale), { maximumFractionDigits: 2 })} %`;
/** Ländername aus dem ISO-Code, z.B. „DE“ → „Deutschland“. */
export const countryName = (code, locale = 'de') => {
    try {
        return new Intl.DisplayNames([intlLocale(locale)], { type: 'region' }).of(code.toUpperCase()) ?? code;
    }
    catch {
        return code;
    }
};

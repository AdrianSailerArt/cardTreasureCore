export type UiLocale = 'de' | 'en';
export declare const intlLocale: (locale: string) => "en-GB" | "de-DE";
/** Cent-Betrag als Währung, z.B. 1234 → „12,34 €“; `digits` für ganze Euro in Übersichten. */
export declare const formatPrice: (cents: number | null | undefined, locale?: string, currency?: string, digits?: number) => string;
export declare const formatNumber: (n: number | null | undefined, locale?: string) => string;
/** Datum lesbar („9. Nov. 2026“), mit `withTime` auch Uhrzeit (kurz). */
export declare const formatDate: (iso: string | Date | null | undefined, locale?: string, withTime?: boolean) => string;
/** Satz in Basispunkten als Prozent, z.B. 450 → „4,5 %“. */
export declare const formatRate: (bps: number | null | undefined, locale?: string) => string;
/** Ländername aus dem ISO-Code, z.B. „DE“ → „Deutschland“. */
export declare const countryName: (code: string, locale?: string) => string;

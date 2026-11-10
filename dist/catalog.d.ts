export type UiLocale = 'de' | 'en';
export declare const GAMES: readonly ["mtg", "pokemon", "yugioh"];
export type Game = (typeof GAMES)[number];
export declare const isGame: (value: unknown) => value is Game;
/** Sprachen, in denen Karten gedruckt werden (wie im Datenbank-Enum). */
export declare const CARD_LANGUAGES: readonly ["en", "de", "fr", "it", "es", "pt", "nl", "pl", "ru", "ja", "ko", "zh_cn", "zh_tw"];
/** Zustände vom besten zum schlechtesten (Cardmarket-Skala). */
export declare const CONDITION_ORDER: readonly ["mint", "near_mint", "excellent", "good", "light_played", "played", "poor"];
export declare const CONDITION_SHORT: Record<string, string>;
/** Euro-Eingabe ("1,23", "1.23", "1") in Cent; null bei ungültiger Eingabe. */
export declare const parseEuro: (input: string) => number | null;
/** Richtpreis einer Quelle (Cardmarket, TCGplayer) für eine Variante */
export interface Price {
    source: string;
    finish: string;
    currency: string;
    low: number | null;
    avg: number | null;
    trend: number | null;
}
/** Der aussagekräftigste Wert einer Preisangabe: Trend, sonst Durchschnitt, sonst Tiefstwert. */
export declare const headlinePrice: (p: Price | null | undefined) => number | null;
export declare const gameLabel: (game: string) => string;
export declare const conditionLabel: (condition: string) => string;
export declare const languageLabel: (language: string, locale?: UiLocale) => string;
export declare const finishLabel: (finish: string, locale?: UiLocale) => string;
export declare const sealedTypeLabel: (type: string, locale?: UiLocale) => string;

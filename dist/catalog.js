export const GAMES = ['mtg', 'pokemon', 'yugioh'];
export const isGame = (value) => typeof value === 'string' && GAMES.includes(value);
/** Sprachen, in denen Karten gedruckt werden (wie im Datenbank-Enum). */
export const CARD_LANGUAGES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'ru', 'ja', 'ko', 'zh_cn', 'zh_tw'];
/** Zustände vom besten zum schlechtesten (Cardmarket-Skala). */
export const CONDITION_ORDER = ['mint', 'near_mint', 'excellent', 'good', 'light_played', 'played', 'poor'];
export const CONDITION_SHORT = {
    mint: 'MT', near_mint: 'NM', excellent: 'EX', good: 'GD', light_played: 'LP', played: 'PL', poor: 'PO',
};
/** Euro-Eingabe ("1,23", "1.23", "1") in Cent; null bei ungültiger Eingabe. */
export const parseEuro = (input) => {
    const cleaned = input.trim().replace(/\s|€/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
    if (!/^\d+(\.\d{0,2})?$/.test(cleaned))
        return null;
    return Math.round(Number.parseFloat(cleaned) * 100);
};
/** Der aussagekräftigste Wert einer Preisangabe: Trend, sonst Durchschnitt, sonst Tiefstwert. */
export const headlinePrice = (p) => (p ? (p.trend ?? p.avg ?? p.low) : null);
const GAME_LABELS = { mtg: 'Magic: The Gathering', pokemon: 'Pokémon', yugioh: 'Yu-Gi-Oh!' };
const CONDITION_LABELS = {
    mint: 'Mint', near_mint: 'Near Mint', excellent: 'Excellent', good: 'Good', light_played: 'Light Played', played: 'Played', poor: 'Poor',
};
const LANGUAGE_LABELS = {
    de: { en: 'Englisch', de: 'Deutsch', fr: 'Französisch', it: 'Italienisch', es: 'Spanisch', pt: 'Portugiesisch', nl: 'Niederländisch', pl: 'Polnisch', ru: 'Russisch', ja: 'Japanisch', ko: 'Koreanisch', zh_cn: 'Chinesisch (vereinfacht)', zh_tw: 'Chinesisch (traditionell)' },
    en: { en: 'English', de: 'German', fr: 'French', it: 'Italian', es: 'Spanish', pt: 'Portuguese', nl: 'Dutch', pl: 'Polish', ru: 'Russian', ja: 'Japanese', ko: 'Korean', zh_cn: 'Chinese (simplified)', zh_tw: 'Chinese (traditional)' },
};
const FINISH_LABELS = {
    de: { normal: 'Normal', foil: 'Foil', etched: 'Etched', holo: 'Holo', reverse_holo: 'Reverse Holo', firstEdition: '1. Edition' },
    en: { normal: 'Normal', foil: 'Foil', etched: 'Etched', holo: 'Holo', reverse_holo: 'Reverse holo', firstEdition: '1st edition' },
};
export const gameLabel = (game) => GAME_LABELS[game] ?? game;
export const conditionLabel = (condition) => CONDITION_LABELS[condition] ?? condition;
export const languageLabel = (language, locale = 'de') => LANGUAGE_LABELS[locale][language] ?? language.toUpperCase();
export const finishLabel = (finish, locale = 'de') => FINISH_LABELS[locale][finish] ?? finish;
const SEALED_TYPE_LABELS = {
    de: { booster: 'Booster', booster_display: 'Display', collector_booster: 'Collector Booster', bundle: 'Bundle', elite_trainer_box: 'Elite Trainer Box', starter_deck: 'Starter Deck', structure_deck: 'Structure Deck', commander_deck: 'Commander Deck', tin: 'Tin', collection_box: 'Kollektion', other: 'Sonstiges' },
    en: { booster: 'Booster', booster_display: 'Display', collector_booster: 'Collector booster', bundle: 'Bundle', elite_trainer_box: 'Elite Trainer Box', starter_deck: 'Starter deck', structure_deck: 'Structure deck', commander_deck: 'Commander deck', tin: 'Tin', collection_box: 'Collection box', other: 'Other' },
};
export const sealedTypeLabel = (type, locale = 'de') => SEALED_TYPE_LABELS[locale][type] ?? type;

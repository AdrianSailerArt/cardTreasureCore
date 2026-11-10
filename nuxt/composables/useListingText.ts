/** Texte der Angebots-Bausteine (Kartensuche, Druckauswahl, Angebotsformular) in der Sprache der Oberfläche. */
const TEXT = {
  de: {
    step1: '1. Karte suchen', step2: '2. Druck wählen', step3: '3. Angebot', otherCard: 'Andere Karte', done: 'Fertig',
    kind: 'Was möchtest du verkaufen?', kindSingle: 'Einzelkarte', kindSealed: 'Sealed-Produkt',
    sealedStep1: '1. Sealed-Produkt suchen', sealedStep2: '2. Angebot', otherProduct: 'Anderes Produkt', searchSealed: 'Sealed-Produkt suchen (Name oder Set) …',
    created: (n: number) => (n === 1 ? 'Angebot eingestellt.' : `${n} Angebote eingestellt.`),
    search: 'Karte suchen …', allGames: 'Alle Spiele', noResults: 'Nichts gefunden.', searching: 'Wird gesucht …', loading: 'Wird geladen …',
    printingCount: (n: number) => (n === 1 ? '1 Druck' : `${n} Drucke`), from: 'ab', noOffersYet: 'noch keine Angebote',
    condition: 'Zustand', language: 'Sprache', finish: 'Variante', quantity: 'Menge', price: 'Preis pro Stück',
    comment: 'Kommentar', commentHint: 'Optional, z.B. kleine Mängel. Max. 200 Zeichen.', commentPlaceholder: 'z.B. Direkt aus dem Booster in die Hülle', commentPlaceholderSealed: 'z.B. Originalverpackt, Folie unbeschädigt',
    toploader: 'Versand im Toploader', toploaderHint: 'Die Karte ist dann schwerer und dicker. Das wird beim Versand automatisch berücksichtigt, der Käufer zahlt den Toploader mit.',
    storage: 'Lagerplatz', storageHint: 'Nur für dich sichtbar, z.B. wo die Karte liegt. Käufer sehen das nie.', storagePlaceholder: 'z.B. Ordner 3, Seite 12',
    create: 'Angebot einstellen', save: 'Speichern', usePrice: 'Diesen Preis übernehmen',
    priceInvalid: 'Bitte einen Betrag wie 1,50 eingeben.', priceMin: 'Mindestpreis 0,10 €.',
    guideReference: 'Richtpreis', guideTrend: 'Trend', guideMarketFrom: 'Andere ab', guideNone: 'Für diesen Druck gibt es noch keine Preisdaten.', guideNoneSealed: 'Für dieses Produkt gibt es noch keine Preisdaten.',
    photoHint: 'Ab 50 € empfehlen wir ein echtes Foto. Du kannst es direkt nach dem Einstellen hochladen.',
    error: 'Das hat nicht geklappt. Bitte versuche es noch einmal.',
  },
  en: {
    step1: '1. Find card', step2: '2. Choose printing', step3: '3. Offer', otherCard: 'Other card', done: 'Done',
    kind: 'What do you want to sell?', kindSingle: 'Single card', kindSealed: 'Sealed product',
    sealedStep1: '1. Find sealed product', sealedStep2: '2. Offer', otherProduct: 'Other product', searchSealed: 'Search sealed products (name or set) …',
    created: (n: number) => (n === 1 ? 'Offer published.' : `${n} offers published.`),
    search: 'Search for a card …', allGames: 'All games', noResults: 'Nothing found.', searching: 'Searching …', loading: 'Loading …',
    printingCount: (n: number) => (n === 1 ? '1 printing' : `${n} printings`), from: 'from', noOffersYet: 'no offers yet',
    condition: 'Condition', language: 'Language', finish: 'Finish', quantity: 'Quantity', price: 'Price each',
    comment: 'Comment', commentHint: 'Optional, e.g. small flaws. Max. 200 characters.', commentPlaceholder: 'e.g. Straight from pack to sleeve', commentPlaceholderSealed: 'e.g. Factory sealed, wrap intact',
    toploader: 'Ships in a toploader', toploaderHint: 'The card is heavier and thicker then. Shipping accounts for it automatically and the buyer pays for the toploader.',
    storage: 'Storage location', storageHint: 'Only visible to you, e.g. where the card is kept. Buyers never see it.', storagePlaceholder: 'e.g. Binder 3, page 12',
    create: 'Publish offer', save: 'Save', usePrice: 'Use this price',
    priceInvalid: 'Please enter an amount like 1.50.', priceMin: 'Minimum price €0.10.',
    guideReference: 'Reference', guideTrend: 'Trend', guideMarketFrom: 'Others from', guideNone: 'No price data for this printing yet.', guideNoneSealed: 'No price data for this product yet.',
    photoHint: 'From €50 we recommend a real photo. You can upload it right after listing.',
    error: 'That didn’t work. Please try again.',
  },
} as const

export const useListingText = () => {
  const locale = useUiLocale()
  return computed(() => TEXT[locale.value])
}

/** Name in der aktuellen Sprache, mit Englisch als Rückfall. */
export const useLocalName = () => {
  const locale = useUiLocale()
  return (en: string, de?: string | null) => (locale.value === 'de' && de ? de : en)
}

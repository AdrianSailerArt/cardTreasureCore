import { describe, expect, test } from 'bun:test'
import { chooseShipping, estimatePackage, FORMAT_LIMITS, PACKAGING_COST, packagingCost, quoteShipping, rejectReason, shippingTariff } from '../src/shipping'

const options = shippingTariff('DE')
const pick = (items: Parameters<typeof estimatePackage>[0], country = 'DE') =>
  chooseShipping(options, estimatePackage(items), country)?.name

describe('estimatePackage', () => {
  test('rechnet Schutz, Verpackung und Puffer ein', () => {
    const pkg = estimatePackage([{ kind: 'single', quantity: 1, unitPriceCents: 50 }])
    // Karte 1,8 + Hülle 0,5 + Umschlag 6 + Pappe 6 = 14,3 g, plus 15 % → 17 g
    expect(pkg.weightG).toBe(17)
    expect(pkg.toploaders).toBe(0)
    expect(pkg.thicknessMm).toBeGreaterThan(2)
  })

  test('Toploader nur, wenn der Verkäufer ihn am Angebot angibt (nicht nach Preis)', () => {
    expect(estimatePackage([{ kind: 'single', quantity: 2, unitPriceCents: 1500 }]).toploaders).toBe(0)
    const pkg = estimatePackage([{ kind: 'single', quantity: 2, unitPriceCents: 1500, toploader: true }])
    expect(pkg.toploaders).toBe(2)
    expect(pkg.thicknessMm).toBeCloseTo(2 * 1.7 + 0.5 + 1, 5)
  })

  test('eine Karte im Toploader ist schwerer als ohne', () => {
    const plain = estimatePackage([{ kind: 'single', quantity: 4, unitPriceCents: 50 }])
    const loaded = estimatePackage([{ kind: 'single', quantity: 4, unitPriceCents: 50, toploader: true }])
    // 4 Toploader zu 5 g statt einer Pappe zu 6 g, plus Puffer
    expect(loaded.weightG).toBeGreaterThan(plain.weightG)
    expect(loaded.weightG).toBe(Math.ceil((6 + 4 * (1.8 + 0.5 + 5)) * 1.15))
  })

  test('Toploader bei Sealed zählt nicht', () => {
    expect(estimatePackage([{ kind: 'sealed', quantity: 1, unitPriceCents: 500, toploader: true }]).toploaders).toBe(0)
  })

  test('Gewicht ist immer etwas mehr als die nackten Karten', () => {
    for (const n of [1, 5, 20, 100]) {
      const pkg = estimatePackage([{ kind: 'single', quantity: n, unitPriceCents: 20 }])
      expect(pkg.weightG).toBeGreaterThan(n * 1.8 * 1.15)
    }
  })
})

describe('chooseShipping', () => {
  test('eine günstige Karte passt in den Standardbrief', () => {
    expect(pick([{ kind: 'single', quantity: 1, unitPriceCents: 50 }])).toBe('Standardbrief')
  })

  test('eine Karte im Toploader passt noch in den Standardbrief', () => {
    expect(pick([{ kind: 'single', quantity: 1, unitPriceCents: 800, toploader: true }])).toBe('Standardbrief')
  })

  test('mehrere Karten wechseln in größere Formate', () => {
    expect(pick([{ kind: 'single', quantity: 8, unitPriceCents: 30 }])).toBe('Kompaktbrief')
    expect(pick([{ kind: 'single', quantity: 40, unitPriceCents: 30 }])).toBe('Großbrief')
  })

  test('die Dicke entscheidet auch bei geringem Gewicht', () => {
    // drei Toploader sind zu dick für den Standardbrief (max. 5 mm)
    const pkg = estimatePackage([{ kind: 'single', quantity: 3, unitPriceCents: 400, toploader: true }])
    expect(pkg.thicknessMm).toBeGreaterThan(FORMAT_LIMITS.standard.maxThicknessMm)
    expect(rejectReason(options.find(o => o.name === 'Standardbrief')!, pkg, 'DE')).not.toBeNull()
  })

  test('über dem Wertlimit wird ein Einschreiben gewählt', () => {
    // 4 × 10 € = 40 €, normale Briefe nur bis 25 €
    expect(pick([{ kind: 'single', quantity: 4, unitPriceCents: 1000 }])).toContain('Einschreiben')
  })

  test('Sealed-Produkte gehen als Paket', () => {
    expect(pick([{ kind: 'sealed', quantity: 1, unitPriceCents: 500 }])).toBe('DHL Paket')
  })

  test('ins Ausland nur internationale Versandarten', () => {
    expect(pick([{ kind: 'single', quantity: 1, unitPriceCents: 50 }], 'AT')).toBe('Standardbrief International')
  })

  test('ohne passende Versandart gibt es null', () => {
    expect(pick([{ kind: 'single', quantity: 1, unitPriceCents: 50 }], 'US')).toBeUndefined()
  })
})

describe('quoteShipping', () => {
  test('liefert Versandart und Preis automatisch', () => {
    const quote = quoteShipping([{ kind: 'single', quantity: 1, unitPriceCents: 50 }], 'DE', 'DE')
    expect(quote).toMatchObject({ service: 'Standardbrief', format: 'standard', postageCents: 95, packagingCents: 30, priceCents: 125, tracked: false })
  })

  test('Verpackung kommt immer aufs Porto: Brief, Paket und je Toploader', () => {
    const letter = quoteShipping([{ kind: 'single', quantity: 2, unitPriceCents: 50, toploader: true }], 'DE', 'DE')!
    expect(letter.packagingCents).toBe(PACKAGING_COST.letterCents + 2 * PACKAGING_COST.toploaderCents)
    expect(letter.priceCents).toBe(letter.postageCents + letter.packagingCents)
    const parcel = quoteShipping([{ kind: 'sealed', quantity: 1, unitPriceCents: 500 }], 'DE', 'DE')!
    expect(parcel).toMatchObject({ format: 'parcel', postageCents: 699, packagingCents: PACKAGING_COST.parcelCents, priceCents: 799 })
    expect(packagingCost('maxi', 0)).toBe(PACKAGING_COST.letterCents)
  })

  test('ins EU-Ausland wird der internationale Tarif genommen', () => {
    const quote = quoteShipping([{ kind: 'single', quantity: 10, unitPriceCents: 50 }], 'DE', 'FR')
    expect(quote?.service).toBe('Kompaktbrief International')
  })

  test('Verkäufer aus Österreich verschicken nach Österreich als Inland', () => {
    expect(quoteShipping([{ kind: 'single', quantity: 1, unitPriceCents: 50 }], 'AT', 'AT')?.service).toBe('Standardbrief')
  })

  test('außerhalb der EU gibt es keinen Versand', () => {
    expect(quoteShipping([{ kind: 'single', quantity: 1, unitPriceCents: 50 }], 'DE', 'US')).toBeNull()
  })
})

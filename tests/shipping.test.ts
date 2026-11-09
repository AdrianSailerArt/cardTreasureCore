import { describe, expect, test } from 'bun:test'
import { chooseShipping, estimatePackage, FORMAT_LIMITS, quoteShipping, rejectReason, shippingTariff } from '../src/shipping'

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

  test('wertvolle Karten kommen in den Toploader', () => {
    const pkg = estimatePackage([{ kind: 'single', quantity: 2, unitPriceCents: 1500 }])
    expect(pkg.toploaders).toBe(2)
    expect(pkg.thicknessMm).toBeCloseTo(2 * 1.7 + 0.5 + 1, 5)
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
    expect(pick([{ kind: 'single', quantity: 1, unitPriceCents: 800 }])).toBe('Standardbrief')
  })

  test('mehrere Karten wechseln in größere Formate', () => {
    expect(pick([{ kind: 'single', quantity: 8, unitPriceCents: 30 }])).toBe('Kompaktbrief')
    expect(pick([{ kind: 'single', quantity: 40, unitPriceCents: 30 }])).toBe('Großbrief')
  })

  test('die Dicke entscheidet auch bei geringem Gewicht', () => {
    // drei Toploader sind zu dick für den Standardbrief (max. 5 mm)
    const pkg = estimatePackage([{ kind: 'single', quantity: 3, unitPriceCents: 400 }])
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
    expect(quote).toMatchObject({ service: 'Standardbrief', format: 'standard', priceCents: 95, tracked: false })
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

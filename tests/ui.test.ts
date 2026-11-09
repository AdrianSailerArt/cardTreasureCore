import { describe, expect, test } from 'bun:test'
import { countryName, formatDate, formatNumber, formatPrice, formatRate } from '../src/format'
import { STATUS_LABELS, statusLabel, statusTone } from '../src/status'

describe('Formatierung', () => {
  test('Preise je Sprache', () => {
    expect(formatPrice(1234, 'de')).toBe('12,34 €')
    expect(formatPrice(1234, 'en')).toBe('€12.34')
    expect(formatPrice(123400, 'de', 'EUR', 0)).toBe('1.234 €')
    expect(formatPrice(null)).toBe('–')
  })
  test('Zahlen, Sätze, Datum, Länder', () => {
    expect(formatNumber(12345, 'de')).toBe('12.345')
    expect(formatRate(450, 'de')).toBe('4,5 %')
    expect(formatRate(500, 'en')).toBe('5 %')
    expect(formatDate('2026-11-09T12:00:00Z', 'de')).toContain('2026')
    expect(countryName('de', 'de')).toBe('Deutschland')
    expect(countryName('DE', 'en')).toBe('Germany')
  })
})

describe('Status', () => {
  test('Ampel', () => {
    expect(statusTone('completed')).toBe('success')
    expect(statusTone('shipped')).toBe('info')
    expect(statusTone('pending_payment')).toBe('warning')
    expect(statusTone('disputed')).toBe('danger')
    expect(statusTone('unbekannt')).toBe('neutral')
  })
  test('Bezeichnungen vollständig in beiden Sprachen', () => {
    expect(Object.keys(STATUS_LABELS.de).sort()).toEqual(Object.keys(STATUS_LABELS.en).sort())
    expect(statusLabel('pending_payment', 'de')).toBe('Zahlung offen')
    expect(statusLabel('pending_payment', 'en')).toBe('Payment pending')
  })
})

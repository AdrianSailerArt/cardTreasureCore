import { describe, expect, test } from 'bun:test'
import { slugify } from '../src/slug'

describe('slugify', () => {
  test('Umlaute, ß, Sonderzeichen, Länge', () => {
    expect(slugify('Größte Übersicht: Magic & Pokémon!')).toBe('grosste-ubersicht-magic-pokemon')
    expect(slugify('Straße')).toBe('strasse')
    expect(slugify('a'.repeat(100), 10)).toHaveLength(10)
  })
})

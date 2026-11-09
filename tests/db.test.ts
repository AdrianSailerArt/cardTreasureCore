import { describe, expect, test } from 'bun:test'
import { isLocalDatabase, pgOptions } from '../src/db'

describe('Datenbank-Verbindung', () => {
  test('lokal ohne SSL, sonst SSL Pflicht; immer ohne Prepared Statements (Pooler)', () => {
    expect(isLocalDatabase('postgres://u:p@localhost:5432/x')).toBe(true)
    expect(isLocalDatabase('postgres://u:p@db:5432/x')).toBe(true)
    expect(pgOptions('postgres://u:p@localhost:5432/x').ssl).toBe(false)
    const supa = pgOptions('postgresql://postgres.abc:pw@aws-0-eu-central-1.pooler.supabase.com:6543/postgres')
    expect(supa).toMatchObject({ ssl: 'require', prepare: false, max: 5 })
  })
})

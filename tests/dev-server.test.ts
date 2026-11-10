import { describe, expect, test } from 'bun:test'
import { devEnv } from '../src/dev-server'
import { rowsOf } from '../src/db'
import { sql } from 'drizzle-orm'

describe('Dev-Server-Umgebung', () => {
  const urls = { NUXT_PUBLIC_SITE_URL: 3100, NUXT_PUBLIC_SHOP_URL: 3000 }
  test('localhost-Werte und fehlende Werte zeigen auf die LAN-Adresse', () => {
    const env = devEnv({ NUXT_PUBLIC_SITE_URL: 'http://localhost:3100' }, '192.168.1.20', urls)
    expect(env.NUXT_PUBLIC_SITE_URL).toBe('http://192.168.1.20:3100')
    expect(env.NUXT_PUBLIC_SHOP_URL).toBe('http://192.168.1.20:3000')
  })
  test('eigene Adressen bleiben, ohne Netzwerk bleibt alles', () => {
    expect(devEnv({ NUXT_PUBLIC_SITE_URL: 'https://cms.example.com' }, '192.168.1.20', urls).NUXT_PUBLIC_SITE_URL).toBe('https://cms.example.com')
    expect(devEnv({ NUXT_PUBLIC_SITE_URL: 'http://localhost:3100' }, null, urls).NUXT_PUBLIC_SITE_URL).toBe('http://localhost:3100')
  })
})

describe('rowsOf', () => {
  test('gibt die Zeilen von execute zurück', async () => {
    const db = { execute: async () => [{ n: 1 }] }
    expect(await rowsOf<{ n: number }>(db, sql`select 1 as n`)).toEqual([{ n: 1 }])
  })
})

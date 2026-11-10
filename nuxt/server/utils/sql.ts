import type { SQL } from 'drizzle-orm'
import { rowsOf } from '@cardtreasure/core/db'

/**
 * Lesende SQL-Abfrage auf der Datenbank der App, Zeilen typisiert. Erwartet `useDb()` in server/utils der App
 * (Shop: eigenes Schema, CMS: generiertes Schema). In Fachmodulen stattdessen `rowsOf(db, …)` mit übergebener Datenbank.
 */
export const rows = async <T>(query: SQL): Promise<T[]> => await rowsOf<T>(useDb(), query)

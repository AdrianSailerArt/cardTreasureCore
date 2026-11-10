import { z } from 'zod'
import { GAMES } from '@cardtreasure/core/catalog'

/*
 * Gemeinsame Query-Parameter für API-Routen in Shop und CMS. Sie sind nachsichtig: ein fehlender oder unbekannter
 * Wert fällt auf den Standard zurück, statt die Anfrage mit 400 abzulehnen (Links mit alten Parametern sollen weiter funktionieren).
 *   const query = z.object({ locale: localeParam, game: gameParam, all: flagParam })
 */

/** Sprache der Antwort (?locale=en); alles andere ist Deutsch. */
export const localeParam = z.enum(['de', 'en']).catch('de')

/** Optionaler Spielfilter (?game=mtg); unbekannte Werte zählen als "kein Filter". */
export const gameParam = z.enum(GAMES).nullable().catch(null)

/** Schalter (?all=1): nur "1" schaltet ein. */
export const flagParam = z.unknown().transform(v => v === '1')

/*
 * Verbindungsoptionen für Postgres (postgres.js) in Shop, CMS und Skripten, lokal wie bei Supabase/Neon:
 *   prepare: false  nötig hinter einem Pooler im Transaktionsmodus (Supabase Supavisor Port 6543, Neon PgBouncer)
 *   max_pipeline 1  außer lokal: Supavisor im Transaktionsmodus verträgt keine mehreren Abfragen hintereinander auf einer
 *                   Verbindung ohne Antwort dazwischen (Pipelining); parallele Abfragen hängen sonst bis zum statement_timeout
 *   ssl             Pflicht für jede Datenbank außer der lokalen (Docker)
 *   kurze Leerlaufzeit, damit serverlose Funktionen (Vercel) Verbindungen schnell zurückgeben
 */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]', 'db', 'host.docker.internal'])

export const isLocalDatabase = (url: string) => {
  try {
    return LOCAL_HOSTS.has(new URL(url).hostname)
  }
  catch {
    return false
  }
}

export const pgOptions = (url: string, max = 5) => ({
  prepare: false,
  max,
  max_pipeline: isLocalDatabase(url) ? 100 : 1,
  ssl: isLocalDatabase(url) ? false as const : 'require' as const,
  idle_timeout: 20,
  connect_timeout: 15,
  onnotice: () => {},
})

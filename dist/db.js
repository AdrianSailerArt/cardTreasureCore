/*
 * Verbindungsoptionen für Postgres (postgres.js) in Shop, CMS und Skripten, lokal wie bei Supabase/Neon:
 *   prepare: false  nötig hinter einem Pooler im Transaktionsmodus (Supabase Supavisor Port 6543, Neon PgBouncer)
 *   ssl             Pflicht für jede Datenbank außer der lokalen (Docker)
 *   kurze Leerlaufzeit, damit serverlose Funktionen (Vercel) Verbindungen schnell zurückgeben
 */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]', 'db', 'host.docker.internal']);
export const isLocalDatabase = (url) => {
    try {
        return LOCAL_HOSTS.has(new URL(url).hostname);
    }
    catch {
        return false;
    }
};
export const pgOptions = (url, max = 5) => ({
    prepare: false,
    max,
    ssl: isLocalDatabase(url) ? false : 'require',
    idle_timeout: 20,
    connect_timeout: 15,
    onnotice: () => { },
});

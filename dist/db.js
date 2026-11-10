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
    max_pipeline: isLocalDatabase(url) ? 100 : 1,
    ssl: isLocalDatabase(url) ? false : 'require',
    idle_timeout: 20,
    connect_timeout: 15,
    onnotice: () => { },
});
/** Rohes SQL ausführen und die Zeilen typisiert zurückgeben (Spaltennamen im SQL als "camelCase" benennen). */
export const rowsOf = async (db, query) => await db.execute(query);

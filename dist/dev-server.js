/*
 * Entwicklungsserver von Shop und CMS, im lokalen Netzwerk erreichbar (Handy, Tablet, andere Rechner).
 *
 * Erkennt die LAN-Adresse dieses Rechners und setzt damit die übergebenen URL-Variablen, damit Links in Mails
 * (Anmeldelink, Benachrichtigungen) und Verweise zwischen den Apps auch auf anderen Geräten funktionieren.
 * localhost-Werte aus der .env werden ersetzt, eigene Adressen (z.B. eine Domain) bleiben.
 * Ohne Netzwerk bleibt es bei localhost. Nur lokal: DEV_HOST=localhost bun run dev
 */
import { spawn } from 'node:child_process';
import { lanAddress } from './lan.js';
/** Umgebung für den Dev-Server: localhost-Werte durch die LAN-Adresse ersetzen, eigene Adressen behalten. */
export const devEnv = (base, ip, lanUrls) => {
    const env = { ...base };
    if (!ip)
        return env;
    for (const [key, port] of Object.entries(lanUrls)) {
        if (!env[key] || env[key].includes('localhost'))
            env[key] = `http://${ip}:${port}`;
    }
    return env;
};
/** Startet `nuxt dev` und endet mit dessen Exit-Code. */
export const startDevServer = ({ label, defaultPort, lanUrls }) => {
    const port = Number(process.env.PORT ?? defaultPort);
    const ip = process.env.DEV_HOST === 'localhost' ? null : lanAddress();
    // Der eigene Port gilt für alle URLs, die auf den Standard-Port dieser App zeigen
    const urls = Object.fromEntries(Object.entries(lanUrls).map(([key, p]) => [key, p === defaultPort ? port : p]));
    console.info(ip
        ? `\n  ${label} im Netzwerk:  http://${ip}:${port}  (Geräte im selben WLAN)\n`
        : '\n  Kein Netzwerk gefunden, nur http://localhost erreichbar.\n');
    const child = spawn('bunx', ['--bun', 'nuxt', 'dev', '--port', String(port), ...(ip ? ['--host', '0.0.0.0'] : [])], {
        env: devEnv(process.env, ip, urls), stdio: 'inherit',
    });
    for (const signal of ['SIGINT', 'SIGTERM'])
        process.on(signal, () => child.kill(signal));
    child.on('exit', code => process.exit(code ?? 0));
};

import { lanAddresses } from './lan.js';
/**
 * Herkünfte, denen die Anmeldung (Better Auth trustedOrigins) in der Entwicklung vertraut: localhost und die
 * LAN-Adressen dieses Rechners, für Tests auf Handy/Tablet im selben WLAN. Im Echtbetrieb (enabled = false) leer.
 */
export const devOrigins = (ports, enabled) => (enabled
    ? ['localhost', '127.0.0.1', ...lanAddresses()].flatMap(host => ports.map(port => `http://${host}:${port}`))
    : []);

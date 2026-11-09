/**
 * Herkünfte, denen die Anmeldung (Better Auth trustedOrigins) in der Entwicklung vertraut: localhost und die
 * LAN-Adressen dieses Rechners, für Tests auf Handy/Tablet im selben WLAN. Im Echtbetrieb (enabled = false) leer.
 */
export declare const devOrigins: (ports: number[], enabled: boolean) => string[];

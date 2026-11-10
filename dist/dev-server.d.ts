export type DevServerOptions = {
    /** Name in der Startmeldung ("Shop", "CMS") */
    label: string;
    /** Port, wenn PORT nicht gesetzt ist */
    defaultPort: number;
    /** Umgebungsvariablen, die auf die LAN-Adresse zeigen sollen: Name → Port (z.B. { NUXT_PUBLIC_SITE_URL: 3000 }) */
    lanUrls: Record<string, number>;
};
/** Umgebung für den Dev-Server: localhost-Werte durch die LAN-Adresse ersetzen, eigene Adressen behalten. */
export declare const devEnv: (base: Record<string, string | undefined>, ip: string | null, lanUrls: Record<string, number>) => {
    [x: string]: string | undefined;
};
/** Startet `nuxt dev` und endet mit dessen Exit-Code. */
export declare const startDevServer: ({ label, defaultPort, lanUrls }: DevServerOptions) => void;

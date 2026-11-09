/*
 * E-Mail-Versand für Shop und CMS hinter einer kleinen Schnittstelle, ohne Nuxt-Abhängigkeit.
 *   Brevo (EU, Transaktions-API)  wenn ein API-Schlüssel gesetzt ist; `sandbox` lässt Brevo prüfen, aber nicht zustellen.
 *   SMTP                          sonst, lokal Mailpit aus docker compose (http://localhost:8025).
 *   Konsole                       ohne beides.
 * Fehler werden geworfen: die Outbox (notifications) versucht es später erneut.
 */
import nodemailer from 'nodemailer';
export const BREVO_API = 'https://api.brevo.com/v3/smtp/email';
/** „Name <adresse@domain>“ oder nur die Adresse in Name und Adresse zerlegen. */
export const parseAddress = (value) => {
    const m = value.match(/^\s*(.*?)\s*<\s*([^>]+?)\s*>\s*$/);
    return m ? { name: m[1].replace(/^"|"$/g, '') || undefined, email: m[2] } : { name: undefined, email: value.trim() };
};
export class MailError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
const brevoMailer = (cfg) => {
    const sender = parseAddress(cfg.from);
    const doFetch = cfg.fetch ?? fetch;
    return {
        send: async (m) => {
            const res = await doFetch(BREVO_API, {
                method: 'POST',
                headers: { 'api-key': cfg.brevoApiKey, 'content-type': 'application/json', 'accept': 'application/json' },
                body: JSON.stringify({
                    sender: sender.name ? { name: sender.name, email: sender.email } : { email: sender.email },
                    to: [{ email: m.to }],
                    subject: m.subject,
                    htmlContent: m.html,
                    textContent: m.text,
                    ...(m.tag ? { tags: [m.tag] } : {}),
                    ...(cfg.brevoSandbox ? { headers: { 'X-Sib-Sandbox': 'drop' } } : {}),
                }),
            });
            if (!res.ok) {
                const body = await res.text().catch(() => '');
                let detail = body;
                try {
                    detail = JSON.parse(body).message ?? body;
                }
                catch { /* kein JSON */ }
                throw new MailError(`Brevo ${res.status}: ${detail.slice(0, 200)}`, res.status);
            }
        },
    };
};
export const createMailer = (cfg) => {
    if (cfg.brevoApiKey)
        return brevoMailer({ ...cfg, brevoApiKey: cfg.brevoApiKey });
    if (cfg.smtpUrl) {
        const transport = nodemailer.createTransport(cfg.smtpUrl);
        return {
            send: async (m) => {
                await transport.sendMail({ from: cfg.from, to: m.to, subject: m.subject, html: m.html, text: m.text, headers: m.tag ? { 'X-Mail-Tag': m.tag } : undefined });
            },
        };
    }
    return {
        send: async (m) => {
            console.info(`[mail] an ${m.to}: ${m.subject}\n${m.text}`);
        },
    };
};
/** Welcher Weg aktiv ist (für Start-Log und Health-Check), ohne Geheimnisse. */
export const mailerKind = (cfg) => cfg.brevoApiKey ? (cfg.brevoSandbox ? 'brevo-sandbox' : 'brevo') : cfg.smtpUrl ? 'smtp' : 'console';
/** Sammelt Mails im Speicher (für Tests). */
export const createMemoryMailer = () => {
    const sent = [];
    const mailer = {
        send: async (m) => {
            sent.push(m);
        },
    };
    return { mailer, sent };
};

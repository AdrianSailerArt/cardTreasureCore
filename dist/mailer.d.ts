export type MailMessage = {
    to: string;
    subject: string;
    html: string;
    text: string;
    /** Art der Mail (z.B. order_confirmed, magic_link) für Auswertungen beim Versanddienst */
    tag?: string;
};
export type Mailer = {
    send: (message: MailMessage) => Promise<void>;
};
export type MailerConfig = {
    from: string;
    smtpUrl?: string;
    brevoApiKey?: string;
    /** Brevo-Sandbox: Mail wird angenommen und geprüft, aber nicht zugestellt (X-Sib-Sandbox: drop) */
    brevoSandbox?: boolean;
    /** Für Tests austauschbar */
    fetch?: typeof fetch;
};
export declare const BREVO_API = "https://api.brevo.com/v3/smtp/email";
/** „Name <adresse@domain>“ oder nur die Adresse in Name und Adresse zerlegen. */
export declare const parseAddress: (value: string) => {
    name: string | undefined;
    email: string;
};
export declare class MailError extends Error {
    readonly status?: number | undefined;
    constructor(message: string, status?: number | undefined);
}
export declare const createMailer: (cfg: MailerConfig) => Mailer;
/** Welcher Weg aktiv ist (für Start-Log und Health-Check), ohne Geheimnisse. */
export declare const mailerKind: (cfg: Pick<MailerConfig, "smtpUrl" | "brevoApiKey" | "brevoSandbox">) => "brevo-sandbox" | "brevo" | "smtp" | "console";
/** Sammelt Mails im Speicher (für Tests). */
export declare const createMemoryMailer: () => {
    mailer: Mailer;
    sent: MailMessage[];
};

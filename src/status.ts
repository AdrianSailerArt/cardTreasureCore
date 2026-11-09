/*
 * Ein Wortschatz für Zustände in Shop und CMS: Ampel-Farbton und Bezeichnung (de/en).
 * Grün = erledigt/gut, Blau = läuft, Gelb = wartet, Rot = Problem, Grau = neutral.
 */
export type StatusTone = 'neutral' | 'success' | 'info' | 'warning' | 'danger'

const TONES: Record<StatusTone, readonly string[]> = {
  success: ['completed', 'succeeded', 'published', 'active', 'resolved'],
  info: ['paid', 'shipped', 'delivered', 'running'],
  warning: ['awaiting_payment', 'pending_payment', 'draft', 'paused', 'open'],
  danger: ['cancelled', 'disputed', 'failed', 'removed', 'blocked'],
  neutral: ['sold_out', 'archived', 'dismissed', 'ended'],
}

export const statusTone = (status: string): StatusTone =>
  (Object.keys(TONES) as StatusTone[]).find(t => TONES[t].includes(status)) ?? 'neutral'

export const STATUS_LABELS: Record<'de' | 'en', Record<string, string>> = {
  de: {
    pending_payment: 'Zahlung offen', awaiting_payment: 'Wartet auf Zahlung', paid: 'Bezahlt', shipped: 'Versendet',
    delivered: 'Zugestellt', completed: 'Abgeschlossen', cancelled: 'Storniert', disputed: 'Reklamation',
    active: 'Aktiv', paused: 'Pausiert', sold_out: 'Ausverkauft', removed: 'Entfernt', blocked: 'Gesperrt',
    draft: 'Entwurf', published: 'Veröffentlicht', archived: 'Archiviert',
    running: 'Läuft', succeeded: 'Erfolgreich', failed: 'Fehlgeschlagen',
    open: 'Offen', resolved: 'Erledigt', dismissed: 'Verworfen', ended: 'Beendet',
  },
  en: {
    pending_payment: 'Payment pending', awaiting_payment: 'Awaiting payment', paid: 'Paid', shipped: 'Shipped',
    delivered: 'Delivered', completed: 'Completed', cancelled: 'Cancelled', disputed: 'Disputed',
    active: 'Active', paused: 'Paused', sold_out: 'Sold out', removed: 'Removed', blocked: 'Blocked',
    draft: 'Draft', published: 'Published', archived: 'Archived',
    running: 'Running', succeeded: 'Succeeded', failed: 'Failed',
    open: 'Open', resolved: 'Resolved', dismissed: 'Dismissed', ended: 'Ended',
  },
}

export const statusLabel = (status: string, locale: string = 'de') =>
  STATUS_LABELS[locale === 'en' ? 'en' : 'de'][status] ?? status

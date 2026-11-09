import { describe, expect, test } from 'bun:test'
import { BREVO_API, createMailer, MailError, mailerKind, parseAddress } from '../src/mailer'

const fakeFetch = (status = 201, body = '{"messageId":"<x@brevo>"}') => {
  const calls: { url: string, init: RequestInit }[] = []
  const f = (async (url: string, init: RequestInit) => {
    calls.push({ url, init })
    return new Response(body, { status })
  }) as unknown as typeof fetch
  return { f, calls }
}
const mail = { to: 'kunde@example.test', subject: 'Bestellung bestätigt', html: '<p>Danke</p>', text: 'Danke', tag: 'order_confirmed' }

describe('Mailer', () => {
  test('Absender zerlegen', () => {
    expect(parseAddress('CardTreasure <hallo@cardtreasure.eu>')).toEqual({ name: 'CardTreasure', email: 'hallo@cardtreasure.eu' })
    expect(parseAddress('"Card Treasure" <a@b.eu>')).toEqual({ name: 'Card Treasure', email: 'a@b.eu' })
    expect(parseAddress('a@b.eu')).toEqual({ name: undefined, email: 'a@b.eu' })
  })

  test('Brevo: richtige Anfrage mit Schlüssel, Absender, Text, HTML und Tag', async () => {
    const { f, calls } = fakeFetch()
    await createMailer({ from: 'CardTreasure <hallo@cardtreasure.eu>', brevoApiKey: 'test-key', fetch: f }).send(mail)
    expect(calls).toHaveLength(1)
    expect(calls[0]!.url).toBe(BREVO_API)
    expect((calls[0]!.init.headers as Record<string, string>)['api-key']).toBe('test-key')
    const body = JSON.parse(String(calls[0]!.init.body))
    expect(body).toMatchObject({ sender: { name: 'CardTreasure', email: 'hallo@cardtreasure.eu' }, to: [{ email: 'kunde@example.test' }], subject: mail.subject, htmlContent: mail.html, textContent: mail.text, tags: ['order_confirmed'] })
    expect(body.headers).toBeUndefined()
  })

  test('Brevo-Sandbox setzt X-Sib-Sandbox: drop', async () => {
    const { f, calls } = fakeFetch()
    await createMailer({ from: 'a@b.eu', brevoApiKey: 'k', brevoSandbox: true, fetch: f }).send(mail)
    expect(JSON.parse(String(calls[0]!.init.body)).headers).toEqual({ 'X-Sib-Sandbox': 'drop' })
  })

  test('Fehler von Brevo werden mit Status geworfen (Outbox versucht später erneut)', async () => {
    const { f } = fakeFetch(401, '{"code":"unauthorized","message":"Key not found"}')
    const e = await createMailer({ from: 'a@b.eu', brevoApiKey: 'falsch', fetch: f }).send(mail).catch(err => err)
    expect(e).toBeInstanceOf(MailError)
    expect((e as MailError).status).toBe(401)
    expect((e as MailError).message).toContain('Key not found')
  })

  test('Auswahl des Wegs', () => {
    expect(mailerKind({ brevoApiKey: 'k' })).toBe('brevo')
    expect(mailerKind({ brevoApiKey: 'k', brevoSandbox: true })).toBe('brevo-sandbox')
    expect(mailerKind({ smtpUrl: 'smtp://localhost:1025' })).toBe('smtp')
    expect(mailerKind({})).toBe('console')
  })
})

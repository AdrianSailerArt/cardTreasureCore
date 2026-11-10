/*
 * Feste Testkonten für lokal und Staging (nie Produktion). Anmeldung mit E-Mail + TEST_PASSWORD, wenn der Passwort-Login
 * eingeschaltet ist (NUXT_PUBLIC_DEMO_LOGIN=true). Angelegt vom CMS: bun run testdata --reset.
 * Gemeinsam genutzt vom Schnell-Login im Shop und vom Testdaten-Skript im CMS.
 * Keine Stripe-Daten: Verkäufer richten die Auszahlung wie echte Kunden im Stripe-Testmodus ein.
 */
export const TEST_PASSWORD = 'test1234'
export const TEST_EMAIL_DOMAIN = 'test.cardtreasure.test'

export interface TestAccount {
  id: string
  email: string
  name: string
  username: string
  /** buyer: kauft nur; seller: privater Verkäufer; dealer: gewerblich (kauft auch); admin: CMS */
  role: 'buyer' | 'seller' | 'dealer' | 'admin'
  country: string
  locale: 'de' | 'en'
  address: { street: string, houseNumber: string, postalCode: string, city: string }
  company?: { name: string, vatId: string, displayName: string }
}

export const TEST_ACCOUNTS: TestAccount[] = [
  { id: 'test_buyer', email: `buyer@${TEST_EMAIL_DOMAIN}`, name: 'Karla Käuferin', username: 'karla_kaeuferin', role: 'buyer', country: 'DE', locale: 'de',
    address: { street: 'Schillerstraße', houseNumber: '12', postalCode: '10625', city: 'Berlin' } },
  { id: 'test_buyer_fr', email: `buyer-fr@${TEST_EMAIL_DOMAIN}`, name: 'Camille Martin', username: 'camille_martin', role: 'buyer', country: 'FR', locale: 'en',
    address: { street: 'Rue de Rivoli', houseNumber: '48', postalCode: '75004', city: 'Paris' } },
  { id: 'test_seller', email: `seller@${TEST_EMAIL_DOMAIN}`, name: 'Victor Verkäufer', username: 'victor_verkaeufer', role: 'seller', country: 'DE', locale: 'de',
    address: { street: 'Lindenallee', houseNumber: '7', postalCode: '50667', city: 'Köln' } },
  { id: 'test_dealer', email: `dealer@${TEST_EMAIL_DOMAIN}`, name: 'Hanna Händlerin', username: 'hanna_haendlerin', role: 'dealer', country: 'AT', locale: 'de',
    address: { street: 'Mariahilfer Straße', houseNumber: '88', postalCode: '1070', city: 'Wien' },
    company: { name: 'Drachenhort Cards GmbH', vatId: 'ATU12345678', displayName: 'Drachenhort Cards' } },
  { id: 'test_admin', email: `admin@${TEST_EMAIL_DOMAIN}`, name: 'Ada Admin', username: 'ada_admin', role: 'admin', country: 'DE', locale: 'de',
    address: { street: 'Hauptstraße', houseNumber: '1', postalCode: '80331', city: 'München' } },
]

export const isTestEmail = (email: string) => email.toLowerCase().endsWith(`@${TEST_EMAIL_DOMAIN}`)

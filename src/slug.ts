/** URL-taugliche Kurzform eines Titels: Kleinbuchstaben, Umlaute aufgelöst (ß zu ss), Bindestriche. */
export const slugify = (title: string, max = 80) => title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, max)

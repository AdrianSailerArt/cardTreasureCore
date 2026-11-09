# cardTreasureCore

Gemeinsamer Code für den CardTreasure-Shop (`cardTreasure`) und das CMS (`cardTreasureCMS`).
Was beide Apps brauchen, liegt einmal hier statt als Kopie in zwei Repos.

## Inhalt

| Import | Inhalt |
|---|---|
| `@cardtreasure/core/shipping` | Versand: Paket schätzen (Gewicht, Dicke, Schutz), Tarife, günstigste passende Versandart |
| `@cardtreasure/core/media` | Bilder verarbeiten (WebP, Vorschau, ohne EXIF/GPS), S3-Speicher (SeaweedFS lokal, S3/R2 später) |
| `@cardtreasure/core/images` | Angebotsfotos und ersetzte Kartenbilder (nur SQL, Datenbank wird übergeben) |
| `@cardtreasure/core/slug` | `slugify` |
| `@cardtreasure/core/lan`, `…/dev-origins` | LAN-Adresse finden, vertrauenswürdige Herkünfte für die Entwicklung |
| `@cardtreasure/core/nuxt` | Nuxt-Layer: `UiTable`, `useDebounced`, `useChartTheme`, `chartBase` |

Die Module haben keine Nuxt-Abhängigkeit (außer dem Layer) und werden als TypeScript-Quellen ausgeliefert;
der Layer sorgt dafür, dass Vite und Nitro sie mitübersetzen.

## Einbinden

```bash
bun add git+ssh://git@github.com/AdrianSailerArt/cardTreasureCore.git#v0.1.2
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({ extends: ['@cardtreasure/core/nuxt'] })
```

Die Apps bringen `drizzle-orm`, `sharp` und `aws4fetch` selbst mit (Peer-Abhängigkeiten), damit es davon nur eine Kopie gibt.
Auf Vercel braucht der Build Lesezugriff auf dieses private Repo (Deploy-Key oder GitHub-Token als Umgebungsvariable).

## Ändern und veröffentlichen

1. Hier ändern, `bun test` und `bun run typecheck`.
2. Version in `package.json` erhöhen, committen, taggen: `git tag v0.1.1 && git push --tags`.
3. In Shop und CMS die neue Version eintragen: `bun add git+ssh://git@github.com/AdrianSailerArt/cardTreasureCore.git#v0.1.2`.

Lokal gleichzeitig an Paket und App arbeiten: `bun link` hier, `bun link @cardtreasure/core` in der App.

## Befehle

| Befehl | Zweck |
|---|---|
| `bun test` | Tests (Versandberechnung, slugify) |
| `bun run typecheck` | TypeScript prüfen |

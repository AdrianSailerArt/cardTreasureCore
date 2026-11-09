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
| `@cardtreasure/core/format` | `formatPrice`, `formatNumber`, `formatDate`, `formatRate`, `countryName` (Sprache als Parameter) |
| `@cardtreasure/core/status` | Status-Wortschatz: `statusTone` (Ampel), `statusLabel` (de/en) |
| `@cardtreasure/core/lan`, `…/dev-origins` | LAN-Adresse finden, vertrauenswürdige Herkünfte für die Entwicklung |
| `@cardtreasure/core/nuxt` | Nuxt-Layer: Atoms (`UiButton`, `UiChip`, `UiCombobox`, `UiField`, `UiInput`, `UiNotice`, `UiSegmented`, `UiSelect`, `UiTable`), Components (`Tag`, `Panel`, `PageHeader`, `Stat`, `StatusTag`, `EmptyState`, `CountryFlag`, `ChartFrame`, `Breadcrumbs`, `KeyValueList`), `useUiLocale`, `useUiFormat`, `useDebounced`, `useChartTheme`, `chartBase` |
| `@cardtreasure/core/nuxt/assets/ui.css` | Color-Set, Schrift Geist (lokal, OFL), Formensprache (knapper Radius), sichtbarer Fokus, `font-display`, `label-caps` |

Die Module haben keine Nuxt-Abhängigkeit (außer dem Layer). Sie werden als fertiges JavaScript mit Typen aus `dist/` ausgeliefert
(Nitro übersetzt kein TypeScript aus `node_modules`); `dist/` liegt deshalb mit im Repo. Der Nuxt-Layer bleibt Quelltext, den übersetzt Nuxt.

## Einbinden

```bash
bun add git+ssh://git@github.com/AdrianSailerArt/cardTreasureCore.git#v0.4.2
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({ extends: ['@cardtreasure/core/nuxt'] })
```

```css
/* app/assets/css/main.css */
@import "tailwindcss";
@import "@cardtreasure/core/nuxt/assets/ui.css";
```

Die Atoms sind barrierefrei angelegt (Mindestgrößen, `aria-pressed`, Fehler als `alert`, Fokusring global).
Eine gleichnamige Komponente in der App würde die des Layers überdecken, daher dort keine Kopien.

Die Apps bringen `drizzle-orm`, `sharp` und `aws4fetch` selbst mit (Peer-Abhängigkeiten), damit es davon nur eine Kopie gibt.
Auf Vercel braucht der Build Lesezugriff auf dieses private Repo (Deploy-Key oder GitHub-Token als Umgebungsvariable).

## Ändern und veröffentlichen

1. In `src/` bzw. `nuxt/` ändern, dann `bun run release` (baut `dist/` und testet) und `bun run typecheck`.
2. Version in `package.json` erhöhen, committen (mit `dist/`), taggen: `git tag v0.2.1 && git push && git push --tags`.
3. In Shop und CMS die neue Version eintragen: `bun add git+ssh://git@github.com/AdrianSailerArt/cardTreasureCore.git#v0.4.2`.

Wichtig: Relative Importe in `src/` mit `.js`-Endung schreiben (`./media.js`), damit das übersetzte JavaScript auch in Node läuft.

## Befehle

| Befehl | Zweck |
|---|---|
| `bun test` | Tests (Versandberechnung, slugify) |
| `bun run typecheck` | TypeScript prüfen |

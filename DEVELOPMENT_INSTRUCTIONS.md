# Currency Hub Development Instructions

These instructions define how to build this app. Follow them before and during every development task in this repository.

## Project Goal

Build a mobile-first PWA for tracking and converting exchange rates. The app follows `design.pen` and uses `fxapi.app` as the primary exchange-rate provider.

Primary user flows:

- Convert an amount into the selected target currency.
- Select favorite currencies.
- Search and manage the currency list.
- Open a currency pair detail view with history chart and period stats.
- Change theme, locale, and target currency.
- Install the app as a PWA.
- Keep the app useful offline with cached rates and history.

## Required Stack

- Vite.
- React Router.
- React `19.2.4`.
- TypeScript.
- Tailwind CSS v4.
- shadcn/ui.
- use-intl.
- Feature-Sliced Design v2.1.
- IndexedDB for offline data persistence.
- Service worker for PWA caching.
- `fxapi.app` for exchange rates.

Use `bun` as the package runner because this project has `bun.lock`.

## Mandatory Pre-Work

Before changing app code:

1. Read `AGENTS.md`.
2. For Vite, React Router, Tailwind, and shadcn changes, prefer local package docs and existing project patterns over assumptions.
3. For shadcn/ui work, run:
   - `bunx --bun shadcn@latest info --json`
4. Before using a shadcn component, check docs:
   - `bunx --bun shadcn@latest docs <component>`

Do not reintroduce Next.js, Next App Router, `next-intl`, or `next/font`.

## Architecture Rules

Use Feature-Sliced Design v2.1. Keep React Router route setup thin and keep application logic inside FSD layers.

This project uses Vite + React Router. Routing lives in `src/config/app-router.tsx`. Do not create a Next `app/`, root `pages/`, or `src/pages/`. The FSD app layer is named `src/config`, and the FSD page layer is named `src/screens` in this repository.

FSD layer order:

```txt
config -> screens -> widgets -> features -> entities -> shared
```

Import rules:

- A layer may import only from layers below it.
- Cross-imports between slices on the same layer are forbidden.
- Every slice exports through its public API, usually `index.ts`.
- Do not import from another slice's internal `ui/`, `model/`, `api/`, or `lib/` files.
- `shared/` has no slices; expose public APIs per segment, for example `shared/ui`, `shared/api`, `shared/lib`.
- The deprecated FSD `processes/` layer must not be used.

React Router integration:

- Router configuration lives in `src/config/app-router.tsx`.
- FSD route-level UI lives in `src/screens`, not `src/pages`.
- FSD app-level setup lives in `src/config`.
- Do not add a root or `src/app/` folder.
- Do not add a root `pages/` folder.
- If API proxy/server behavior is needed, document the chosen runtime explicitly before adding it.

Recommended target structure:

```txt
src/
  config/
    app-router.tsx
    providers/
      index.tsx
    styles/
      globals.css
    api-routes/
  screens/
    converter/
      ui/
      model/
      index.ts
    currency-list/
      ui/
      model/
      index.ts
    currency-detail/
      ui/
      model/
      index.ts
    settings/
      ui/
      model/
      index.ts
  widgets/
    mobile-shell/
    bottom-navigation/
  features/
    change-target-currency/
    change-locale/
    change-theme/
    manage-favorite-currencies/
    refresh-rates/
  entities/
    currency/
    exchange-rate/
    currency-pair/
    user-settings/
  shared/
    ui/
    api/
      fxapi-client.ts
      fxapi-endpoints.ts
    config/
      routes.ts
      locales.ts
    lib/
      cn.ts
      format-date.ts
    storage/
      indexed-db.ts
    pwa/
  i18n/
    routing.ts
    request.ts
  messages/
    en.json
    ru.json
```

Start simple and extract only when there is real reuse:

- Page-specific UI and state stays in `src/screens/<screen>`.
- Large reused UI blocks move to `src/widgets`.
- Reused user interactions move to `src/features`.
- Reused business domains move to `src/entities`.
- Infrastructure with no business logic stays in `src/shared`.

Currency app placement:

- `shared/api`: low-level `fxapi.app` client, endpoint constants, fetch wrapper.
- `entities/currency`: currency code/name/icon model and display helpers.
- `entities/exchange-rate`: normalized rate model and rate formatting.
- `entities/currency-pair`: pair history model, period stats, volatility calculations.
- `entities/user-settings`: persisted settings model.
- `features/change-target-currency`: user interaction for changing target currency.
- `features/manage-favorite-currencies`: selecting and removing favorites.
- `features/refresh-rates`: manual refresh and sync status behavior.
- `widgets/mobile-shell`: mobile frame, safe-area layout, bottom navigation slots.
- `screens/*`: route-level composition and page-specific state.

Use domain-based filenames. Avoid vague technical names like `types.ts`, `utils.ts`, or `helpers.ts` when a domain-specific name is possible.

Path aliases should map FSD layers explicitly in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/config/*": ["src/config/*"],
      "@/screens/*": ["src/screens/*"],
      "@/widgets/*": ["src/widgets/*"],
      "@/features/*": ["src/features/*"],
      "@/entities/*": ["src/entities/*"],
      "@/shared/*": ["src/shared/*"]
    }
  }
}
```

For Server Components and Client Components, split public APIs only when needed:

- `index.ts`: shared types, constants, pure functions.
- `index.client.ts`: client components, hooks, browser APIs, IndexedDB access.
- `index.server.ts`: server components and server-only data access.

## Rate Provider Rules

Never call `fxapi.app` directly from UI components. Use a provider interface.

Core provider capabilities:

- `getCurrencies()`
- `getLatestRates(base)`
- `getPairRate(base, target)`
- `getHistory(base, target, from, to)`

Primary endpoints:

- `https://fxapi.app/api/{base}.json`
- `https://fxapi.app/api/{base}/{target}.json`
- `https://fxapi.app/api/history/{base}/{target}.json?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `https://fxapi.app/api/currencies.json`

Normalize API responses into internal types before storage or rendering.

Use internal fields:

- `base`
- `target`
- `rate`
- `timestamp`
- `date`
- `rates`
- `stats`
- `source`
- `fetchedAt`
- `isStale`

Do not bind UI to raw API response shapes.

## Offline-First Rules

Offline support is a core feature, not a later enhancement.

Use IndexedDB for:

- currencies list;
- latest rates by base currency;
- pair rates;
- history by `base-target-period`;
- user settings;
- cache metadata.

Required cache behavior:

- App shell must load offline after first successful visit.
- Latest rates use network-first with cached fallback.
- Historical ranges use network-first with cached fallback.
- Static assets use cache-first or stale-while-revalidate.
- Show stale data when offline instead of blank screens.
- Show last update time and stale/offline state in the UI.

First launch without network:

- Render the app shell.
- Show an empty offline state.
- Keep settings accessible.
- Explain that rates require one successful online sync.

## PWA Requirements

Implement:

- `public/manifest.webmanifest`.
- App icons, including maskable icons.
- `display: "standalone"`.
- mobile viewport-safe layout.
- service worker registration.
- offline reload support.
- installability verified in browser tooling.

Manifest should use the product identity, not scaffold defaults:

- name: `Currency Hub`
- short name: `Currency Hub`
- start URL: locale-aware if routing requires it.
- theme/background colors aligned with the design tokens.

## UI And Design Rules

Use `design.pen` as the source of visual intent.

Design characteristics:

- Mobile-first, 390px baseline.
- Bottom navigation.
- Compact financial dashboard style.
- Light and dark themes.
- Rounded cards and controls, but avoid nesting cards inside cards.
- Geist for headings, Inter-like sans for UI text, mono for rates and currency codes.

Tailwind/shadcn rules:

- Use semantic tokens: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`.
- Avoid raw color classes in component markup unless defining the theme in global CSS.
- Use `gap-*`, not `space-x-*` or `space-y-*`.
- Use `size-*` when width and height are equal.
- Use `cn()` for conditional classes.
- Use shadcn primitives before custom markup.
- Use `ToggleGroup` for theme/language/target segmented controls.
- Use `Badge` for status and currency labels.
- Use `Skeleton` for loading states.
- Use `Empty` or `Alert` for empty/offline/error states.

Client components:

- Add `"use client"` only when needed for state, effects, browser APIs, IndexedDB, or event handlers.
- Keep server components as the default for static shell and route composition.

## Theming

Support:

- `system`
- `light`
- `dark`

Use CSS variables for theme values. Do not duplicate components for light and dark variants.

Map design tokens from `design.pen`:

- accent: `#2F8C75`
- accent soft: `#DDEFE8`
- light surface: `#F6F7F4`
- light raised: `#FFFFFF`
- light text: `#111315`
- light muted: `#68706A`
- dark surface: `#0E1113`
- dark raised: `#181D20`
- dark inverse/card: `#080A0C`
- dark border: `#2B3330`

For Tailwind v4, edit the global stylesheet owned by the FSD app layer: `src/config/styles/globals.css`. Do not create a separate Tailwind config unless the project requires it.

## Internationalization

Use `use-intl` through the provider in `src/i18n`.

Initial locales:

- `ru`
- `en`

Default locale: `ru`.

Use locale-prefixed routes unless a later implementation decision documents otherwise:

```txt
/{locale}
```

All visible strings must come from message files. Do not hardcode Russian or English UI copy inside components, except temporary development-only placeholders.

Currency display names:

1. Prefer `Intl.DisplayNames(locale, { type: "currency" })`.
2. Fall back to API currency names.
3. Add local overrides for unclear or unsupported codes.

Number formatting:

- Use `Intl.NumberFormat`.
- Format rates with enough precision for FX pairs.
- Format large converted amounts compactly only where the design calls for it.

## Currency Icons

Do not depend on `fxapi.app` for icons.

Use a local abstraction:

- fiat: country flag or neutral currency badge;
- `EUR`: neutral euro badge, not a single country flag;
- metals/crypto: neutral badge;
- unknown code: code badge fallback.

Icons must never block rate display.

## State Rules

Persist user settings:

- selected target currency;
- selected favorite currencies;
- theme mode;
- locale;
- last amount;
- last selected chart period.

Recommended default settings:

- locale: `ru`
- theme: `system`
- target currency: `USD`
- favorites: `USD`, `EUR`, `GBP`, `JPY`, `CNY`, `TRY`, `CAD`
- chart period: `30D`

## Data Freshness

Use TTLs to avoid unnecessary API calls.

Suggested TTL:

- currencies list: 24 hours;
- latest rates: 5-15 minutes;
- pair rate: 5-15 minutes;
- history range: 1-24 hours depending on range.

Every displayed rate should be able to show:

- latest source timestamp if available;
- local fetch timestamp;
- stale/offline status.

## Testing And Verification

Before considering a feature complete, run:

```bash
bun run lint
bun run build
```

For PWA/offline work, also verify:

- app loads online;
- app reloads offline after first load;
- rates fall back to IndexedDB cache;
- empty offline state appears on first offline launch;
- manifest is valid;
- service worker is registered;
- no console errors in mobile viewport.

For UI work, test at minimum:

- 375px width;
- 390px width;
- 430px width;
- dark theme;
- long currency names;
- offline/stale state;
- Russian and English locales.

## Implementation Order

1. Initialize shadcn/ui and install required components.
2. Configure local i18n provider and locale-aware React Router routes.
3. Keep the FSD target structure with `src/screens` for route-level UI.
4. Add FSD path aliases in `tsconfig.json`.
5. Define theme tokens in `src/config/styles/globals.css`.
6. Add locale routing and message files.
7. Add PWA manifest and icons.
8. Add service worker strategy.
9. Implement low-level `fxapi.app` client in `shared/api`.
10. Implement currency, exchange-rate, currency-pair, and settings models in `entities`.
11. Implement IndexedDB storage in `shared/storage` and cache orchestration in the owning entity/feature model.
12. Implement settings persistence.
13. Build `widgets/mobile-shell` and `widgets/bottom-navigation`.
14. Build converter page.
15. Build currency list page and target selection feature.
16. Build currency detail page with history chart and stats.
17. Add offline/stale UI states.
18. Verify PWA installability and offline behavior.
19. Add desktop workspace after mobile MVP is stable.

## Definition Of Done

A task is done only when:

- implementation follows this file;
- FSD import direction and public API rules are preserved;
- UI follows `design.pen`;
- app works in the target mobile viewport;
- offline fallback is handled where data is involved;
- Russian and English strings are present for visible copy;
- lint/build pass, or any failure is documented with the exact reason.

export const routing = {
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
} as const;

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: string | null | undefined): value is Locale {
  return routing.locales.includes(value as Locale);
}

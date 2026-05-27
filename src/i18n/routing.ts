export const routing = {
  locales: ["ru", "en"],
  defaultLocale: "ru",
} as const;

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: string | undefined): value is Locale {
  return routing.locales.includes(value as Locale);
}

export function stripLocale(pathname: string) {
  const [, maybeLocale, ...rest] = pathname.split("/");

  if (!isLocale(maybeLocale)) {
    return pathname || "/";
  }

  const normalized = `/${rest.join("/")}`;

  return normalized === "/" ? "/" : normalized.replace(/\/+$/, "");
}

export function withLocale(path: string, locale: Locale) {
  if (!path.startsWith("/")) {
    return path;
  }

  const [pathname, hash] = path.split("#");
  const cleanPathname = stripLocale(pathname);
  const localizedPathname =
    cleanPathname === "/" ? `/${locale}` : `/${locale}${cleanPathname}`;

  return hash ? `${localizedPathname}#${hash}` : localizedPathname;
}

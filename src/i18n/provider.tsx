import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import en from "@/messages/en";
import ru from "@/messages/ru";

import { type Locale } from "./routing";

type Messages = typeof ru;
type TranslationValues = Record<string, string | number>;

const messages = {
  ru,
  en,
} satisfies Record<Locale, Messages>;

const LocaleContext = createContext<Locale>("ru");

function getValue(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, source);
}

function interpolate(message: string, values?: TranslationValues) {
  if (!values) {
    return message;
  }

  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    message,
  );
}

export function I18nProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useTranslations(namespace?: string) {
  const locale = useLocale();

  return useMemo(
    () => (key: string, values?: TranslationValues) => {
      const path = namespace ? `${namespace}.${key}` : key;
      const message = getValue(messages[locale], path);

      if (typeof message !== "string") {
        return path;
      }

      return interpolate(message, values);
    },
    [locale, namespace],
  );
}

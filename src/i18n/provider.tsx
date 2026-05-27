import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { IntlProvider, useTranslations } from 'use-intl';

import en from './messages/en';
import ru from './messages/ru';
import { isLocale, routing, type Locale } from './routing';

const storageKey = 'currency-hub-locale';

const messages = {
  ru,
  en,
} satisfies Record<Locale, typeof ru>;

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
} | null>(null);

function detectBrowserLocale(): Locale {
  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const language of languages) {
    const locale = language.split('-')[0];

    if (isLocale(locale)) {
      return locale;
    }
  }

  return routing.defaultLocale;
}

function getInitialLocale(): Locale {
  const storedLocale = localStorage.getItem(storageKey);

  if (isLocale(storedLocale)) {
    return storedLocale;
  }

  return detectBrowserLocale();
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    localStorage.setItem(storageKey, nextLocale);
    setLocaleState(nextLocale);
  }, []);

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
    }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={contextValue}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocale must be used within I18nProvider');
  }

  return context.locale;
}

export function useSetLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useSetLocale must be used within I18nProvider');
  }

  return context.setLocale;
}

export { useTranslations };

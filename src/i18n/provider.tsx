import type { ReactNode } from 'react';
import { IntlProvider, Locale } from 'use-intl';
export { useTranslations, useLocale } from 'use-intl';

import en from './messages/en';
import ru from './messages/ru';

const messages = {
  ru,
  en,
};

export function I18nProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  return (
    <IntlProvider locale={locale} messages={messages[locale as 'ru' | 'en']}>
      {children}
    </IntlProvider>
  );
}

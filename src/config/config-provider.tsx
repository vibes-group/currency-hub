import { Fragment } from 'react';
import { ThemeProvider } from './theme-provider';
import { NextIntlClientProvider } from 'next-intl';

const ConfigProvider = ({
  children,
}: React.ComponentProps<typeof Fragment>) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider>{children}</NextIntlClientProvider>
    </ThemeProvider>
  );
};
export default ConfigProvider;

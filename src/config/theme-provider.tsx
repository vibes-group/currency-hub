import { ThemeProvider as NextThemesProvider } from '@teispace/next-themes';
import { getTheme } from '@teispace/next-themes/server';

export async function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const initialTheme = await getTheme();

  return <NextThemesProvider initialTheme={initialTheme ?? undefined} {...props} >{children}</NextThemesProvider>;
}

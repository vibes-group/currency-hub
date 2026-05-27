'use client';

import { useTranslations } from 'next-intl';

import { MoonIcon, SunIcon } from '@/shared/icons';
import { Button } from '@/shared/ui';
import { useTheme } from '@teispace/next-themes';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const t = useTranslations('ThemeToggle');
  const isDark = resolvedTheme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';
  const Icon = isDark ? SunIcon : MoonIcon;

  return (
    <Button
      size="icon"
      variant="outline"
      aria-label={t(`switchTo.${nextTheme}`)}
      title={t(`switchTo.${nextTheme}`)}
      onClick={() => setTheme(nextTheme)}
    >
      <Icon />
    </Button>
  );
}

'use client';

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ToggleGroup, ToggleGroupItem } from '@/shared/ui';
import { useTheme } from '@teispace/next-themes';

const themeOptions = [
  { value: 'system', icon: MonitorIcon },
  { value: 'light', icon: SunIcon },
  { value: 'dark', icon: MoonIcon },
] as const;

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const t = useTranslations('ThemeToggle');

  return (
    <ToggleGroup
      type="single"
      value={resolvedTheme}
      onValueChange={(value) => {
        if (value === 'system' || value === 'light' || value === 'dark') {
          setTheme(value);
        }
      }}
      variant="outline"
      spacing={0}
      aria-label={t('label')}
    >
      {themeOptions.map(({ value, icon: Icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={t(value)}>
          <Icon data-icon="inline-start" />
          {t(value)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

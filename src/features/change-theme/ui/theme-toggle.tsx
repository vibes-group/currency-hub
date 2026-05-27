import { useTheme } from '@/config/theme-provider';
import { useTranslations } from '@/i18n/provider';
import { MoonIcon, SunIcon } from '@/shared/icons';
import { Button } from '@/shared/ui';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const t = useTranslations('ThemeToggle');
  const isDark = resolvedTheme === 'dark';
  const targetTheme = isDark ? 'light' : 'dark';
  const Icon = isDark ? SunIcon : MoonIcon;

  return (
    <Button
      size="icon"
      variant="outline"
      aria-label={t(`switchTo.${targetTheme}`)}
      title={t(`switchTo.${targetTheme}`)}
      onClick={() => setTheme(targetTheme)}
    >
      <Icon />
    </Button>
  );
}

import { LocaleToggle } from '@/features/change-locale';
import { ThemeToggle } from '@/features/change-theme';
import { useTranslations } from '@/i18n';
import { Badge, Card, CardContent } from '@/shared/ui';
import { AppLayout } from '@/widgets/app-shell';

export function SettingsPage() {
  const t = useTranslations('Settings');
  const appVersion = import.meta.env.VITE_APP_VERSION;

  return (
    <AppLayout>
      <section className="flex flex-col gap-2">
        <Badge className="w-fit" variant="secondary">
          {t('badge')}
        </Badge>
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-title font-bold leading-ui">
            {t('title')}
          </h1>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <Card className="rounded-lg">
          <CardContent className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-heading text-section-title font-semibold">
                {t('languageTitle')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('languageDescription')}
              </p>
            </div>
            <LocaleToggle />
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardContent className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-heading text-section-title font-semibold">
                {t('themeTitle')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('themeDescription')}
              </p>
            </div>
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card className="rounded-lg bg-surface-subtle">
          <CardContent className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-heading text-section-title font-semibold">
                {t('versionTitle')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('versionDescription')}
              </p>
            </div>
            <Badge variant="outline">{appVersion}</Badge>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
}

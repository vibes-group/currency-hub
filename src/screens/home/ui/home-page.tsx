import { CheckCircle2Icon } from '@/shared/icons';
import { Link } from 'react-router';

import { CurrencyCard } from '@/entities/currency';
import { DEFAULT_TARGET_CURRENCY, useFxapiCacheStore } from '@/entities/fxapi';
import { CurrencyConverterInput } from '@/features/currency-converter';
import { useTranslations } from '@/i18n';
import { AppLayout } from '@/widgets/app-shell';
import { Badge, Button, Card, CardContent } from '@/shared/ui';

export function HomePage() {
  const t = useTranslations('Home');
  const targetCurrencyCode = useFxapiCacheStore(
    (state) => state.targetCurrencyCode ?? DEFAULT_TARGET_CURRENCY,
  );
  const favoriteCurrencyCodes = useFxapiCacheStore(
    (state) => state.favoriteCurrencyCodes,
  );
  const cachedRates = useFxapiCacheStore(
    (state) => state.latestRatesByBase[targetCurrencyCode],
  );

  return (
    <AppLayout>
      <section className="flex flex-col gap-3">
        <CurrencyConverterInput />
      </section>

      <section id="rates" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-section-title font-semibold">
            {t('ratesTitle')}
          </h2>
          <Badge variant="outline">
            <CheckCircle2Icon data-icon="inline-start" />
            {t('live')}
          </Badge>
        </div>

        {favoriteCurrencyCodes.length > 0 ? (
          <div className="flex flex-col gap-2">
            {favoriteCurrencyCodes.map((code) => (
              <CurrencyCard
                key={code}
                code={code}
                description={t('favoriteRate', {
                  base: targetCurrencyCode,
                  code,
                })}
                rate={
                  code === targetCurrencyCode
                    ? 1
                    : cachedRates?.data.rates[code]
                }
              />
            ))}
          </div>
        ) : (
          <Card className="rounded-lg bg-surface-subtle">
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex flex-col gap-1">
                <h3 className="font-heading text-section-title font-semibold">
                  {t('chooseFavoritesTitle')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('chooseFavoritesDescription')}
                </p>
              </div>
              <Button asChild className="w-fit" size="sm">
                <Link to="/list">{t('chooseFavoritesAction')}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </AppLayout>
  );
}

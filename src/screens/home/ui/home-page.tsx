import { CheckCircle2Icon } from '@/shared/icons';
import { Link } from 'react-router';

import { CurrencyCard } from '@/entities/currency';
import {
  DEFAULT_TARGET_CURRENCY,
  useFrankfurterCacheStore,
} from '@/entities/frankfurter';
import {
  CurrencyConverterInput,
  parseConverterAmount,
  useCurrencyConverterStore,
} from '@/features/currency-converter';
import { useTranslations } from '@/i18n';
import { AppLayout } from '@/widgets/app-shell';
import { Badge, Button, Card, CardContent } from '@/shared/ui';

export function HomePage() {
  const t = useTranslations('Home');
  const targetCurrencyCode = useFrankfurterCacheStore(
    (state) => state.targetCurrencyCode ?? DEFAULT_TARGET_CURRENCY,
  );
  const favoriteCurrencyCodes = useFrankfurterCacheStore(
    (state) => state.favoriteCurrencyCodes,
  );
  const cachedRates = useFrankfurterCacheStore(
    (state) => state.latestRatesByBase[targetCurrencyCode],
  );
  const converterAmount = useCurrencyConverterStore((state) =>
    parseConverterAmount(state.amount),
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
                    ? converterAmount
                    : cachedRates?.data.rates[code] !== undefined
                      ? converterAmount * cachedRates.data.rates[code]
                      : undefined
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

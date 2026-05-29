import { CheckCircle2Icon } from '@/shared/icons';

import { CurrencyCard, getCurrencyTrend } from '@/entities/currency';
import { CurrencyConverterInput } from '@/features/currency-converter';
import { useTranslations } from '@/i18n';
import { AppLayout } from '@/widgets/app-shell';
import { Badge } from '@/shared/ui';

const currencies = [
  ['USD', '1.0000', '+0.24%'],
  ['EUR', '0.9228', '-0.08%'],
  ['GBP', '0.7859', '+0.11%'],
] as const;

export function HomePage() {
  const t = useTranslations('Home');

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

        <div className="flex flex-col gap-2">
          {currencies.map(([code, value, trend]) => (
            <CurrencyCard
              key={code}
              code={code}
              description={t('cachedRate')}
              rate={value}
              trend={getCurrencyTrend(trend)}
              trendLabel={trend}
            />
          ))}
        </div>
      </section>
    </AppLayout>
  );
}

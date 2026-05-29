import { StarIcon } from '@/shared/icons';
import { cn } from '@/shared/lib';
import { Badge, Button, Card, CardContent } from '@/shared/ui';

import { getCurrencyTrend, type CurrencyTrend } from '../model/currency';
import { useLocale } from '@/i18n';
import {
  DEFAULT_TARGET_CURRENCY,
  useFrankfurterCacheStore,
} from '@/entities/frankfurter';

type CurrencyCardProps = {
  code: string;
  description?: string;
  rate?: number | string;
  trendLabel?: string;
  trend?: CurrencyTrend;
};

function getTrendVariant(trend: CurrencyTrend) {
  if (trend === 'negative') {
    return 'destructive';
  }

  if (trend === 'positive') {
    return 'secondary';
  }

  return 'outline';
}

function formatRate(locale: string, rate: number) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 6,
  }).format(rate);
}

export function CurrencyCard({
  code,
  description,
  rate,
  trend,
  trendLabel,
}: CurrencyCardProps) {
  const locale = useLocale();

  const resolvedTrend = trend ?? getCurrencyTrend(trendLabel);
  const rateLabel = typeof rate === 'number' ? formatRate(locale, rate) : rate;

  const toggleFavoriteCurrency = useFrankfurterCacheStore(
    (state) => state.toggleFavoriteCurrency,
  );
  const setTargetCurrency = useFrankfurterCacheStore(
    (state) => state.setTargetCurrency,
  );
  const isFavorite = useFrankfurterCacheStore((state) =>
    state.favoriteCurrencyCodes.includes(code),
  );
  const isTarget = useFrankfurterCacheStore(
    (state) => (state.targetCurrencyCode ?? DEFAULT_TARGET_CURRENCY) === code,
  );

  return (
    <Card
      className={cn(
        'rounded-md',
        isTarget && 'border-primary bg-accent-soft/70',
      )}
    >
      <CardContent className="flex items-center gap-3">
        <div className="flex size-(--currency-avatar-size) items-center justify-center rounded-full bg-accent-soft font-data text-sm font-bold text-primary">
          {code}
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-data text-sm font-bold">{code}</div>
          {description ? (
            <div className="text-xs text-muted-foreground">{description}</div>
          ) : null}
        </div>

        <div className="flex flex-col items-end gap-1">
          {rateLabel ? (
            <span className="font-data text-sm font-bold">{rateLabel}</span>
          ) : null}
          {trendLabel ? (
            <Badge variant={getTrendVariant(resolvedTrend)}>{trendLabel}</Badge>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant={'ghost'}
            onClick={() => toggleFavoriteCurrency(code)}
          >
            <StarIcon
              className={cn(isFavorite && 'fill-current text-primary')}
            />
          </Button>
          <Button
            variant={isTarget ? 'default' : 'ghost'}
            onClick={() => setTargetCurrency(code)}
          >
            TARGET
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

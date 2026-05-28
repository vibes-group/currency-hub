import { Badge, Card, CardContent } from '@/shared/ui';

import { getCurrencyTrend, type CurrencyTrend } from '../model/currency';

type CurrencyCardProps = {
  code: string;
  description?: string;
  rate?: number | string;
  trendLabel?: string;
  trend?: CurrencyTrend;
  formatter?: (value: number) => string;
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

export function CurrencyCard({
  code,
  description,
  rate,
  trend,
  trendLabel,
  formatter,
}: CurrencyCardProps) {
  const resolvedTrend = trend ?? getCurrencyTrend(trendLabel);
  const rateLabel =
    typeof rate === 'number' && formatter ? formatter(rate) : rate;

  return (
    <Card className="rounded-md">
      <CardContent className="flex items-center gap-3 p-3">
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
      </CardContent>
    </Card>
  );
}

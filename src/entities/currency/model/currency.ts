export type CurrencyCode = string;

export type CurrencyTrend = 'positive' | 'negative' | 'neutral';

export type Currency = {
  code: CurrencyCode;
  rate?: number | string;
  description?: string;
  trendLabel?: string;
  trend?: CurrencyTrend;
};

export function getCurrencyTrend(value: string | number | undefined): CurrencyTrend {
  if (typeof value === 'number') {
    if (value > 0) {
      return 'positive';
    }

    if (value < 0) {
      return 'negative';
    }

    return 'neutral';
  }

  if (typeof value === 'string') {
    if (value.trim().startsWith('+')) {
      return 'positive';
    }

    if (value.trim().startsWith('-')) {
      return 'negative';
    }
  }

  return 'neutral';
}

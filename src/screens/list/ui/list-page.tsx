import { useEffect, useMemo, useState } from 'react';

import { CurrencyCard } from '@/entities/currency';
import {
  DEFAULT_TARGET_CURRENCY,
  useFxapiCacheStore,
  type FxapiLatestRatesResponse,
} from '@/entities/fxapi';
import { useLocale, useTranslations } from '@/i18n';
import { RefreshCcwIcon, SearchIcon } from '@/shared/icons';
import { Badge, Button, Card, CardContent, Input, Skeleton } from '@/shared/ui';
import { AppLayout } from '@/widgets/app-shell';

type ListStatus =
  | { state: 'loading' }
  | { state: 'error'; message: string }
  | { state: 'ready'; data: FxapiLatestRatesResponse };

function useDebouncedValue(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}

export function ListPage() {
  const locale = useLocale();
  const t = useTranslations('List');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 250);
  const targetCurrencyCode = useFxapiCacheStore(
    (state) => state.targetCurrencyCode ?? DEFAULT_TARGET_CURRENCY,
  );
  const cachedRates = useFxapiCacheStore(
    (state) => state.latestRatesByBase[targetCurrencyCode],
  );
  const isLoading = useFxapiCacheStore(
    (state) => state.latestRatesLoadingByBase[targetCurrencyCode] ?? false,
  );
  const errorMessage = useFxapiCacheStore(
    (state) => state.latestRatesErrorsByBase[targetCurrencyCode],
  );
  const status: ListStatus = cachedRates
    ? { state: 'ready', data: cachedRates.data }
    : errorMessage && !isLoading
      ? { state: 'error', message: errorMessage }
      : { state: 'loading' };

  const rates = useMemo(() => {
    if (status.state !== 'ready') {
      return [];
    }

    return Object.entries(status.data.rates).sort(([left], [right]) =>
      left.localeCompare(right),
    );
  }, [status]);
  const filteredRates = useMemo(() => {
    const normalizedQuery = debouncedSearchQuery.trim().toUpperCase();

    if (!normalizedQuery) {
      return rates;
    }

    return rates.filter(([code]) => code.includes(normalizedQuery));
  }, [debouncedSearchQuery, rates]);

  const updatedAt =
    status.state === 'ready'
      ? new Intl.DateTimeFormat(locale, {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(status.data.timestamp))
      : null;

  return (
    <AppLayout>
      <section className="flex flex-col gap-2">
        <Badge className="w-fit" variant="secondary">
          {t('badge')}
        </Badge>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-heading text-title font-bold leading-ui">
              {t('title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('description', {
                base:
                  status.state === 'ready'
                    ? status.data.base
                    : targetCurrencyCode,
              })}
            </p>
          </div>
          <Badge variant="outline">
            {status.state === 'ready' ? status.data.base : targetCurrencyCode}
          </Badge>
        </div>
        {updatedAt ? (
          <p className="text-xs text-muted-foreground">
            {t('updatedAt', { value: updatedAt })}
          </p>
        ) : null}
      </section>

      <section className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label={t('searchPlaceholder')}
          className="h-11 rounded-2xl bg-card pl-9"
          placeholder={t('searchPlaceholder')}
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </section>

      {status.state === 'loading' ? (
        <section className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="rounded-md">
              <CardContent className="flex items-center gap-3 p-3">
                <Skeleton className="size-(--currency-avatar-size) rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}

      {status.state === 'error' ? (
        <Card className="rounded-lg bg-surface-subtle">
          <CardContent className="flex flex-col gap-3 p-4">
            <div>
              <h2 className="font-heading text-section-title font-semibold">
                {t('errorTitle')}
              </h2>
              <p className="text-sm text-muted-foreground">{status.message}</p>
            </div>
            <Button size="sm" onClick={() => window.location.reload()}>
              <RefreshCcwIcon data-icon="inline-start" />
              {t('retry')}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {status.state === 'ready' ? (
        <section className="flex flex-col gap-2">
          {filteredRates.map(([code, rate]) => (
            <CurrencyCard
              key={code}
              code={code}
              description={t('rateLabel', { base: status.data.base, code })}
              rate={rate}
            />
          ))}
          {filteredRates.length === 0 ? (
            <Card className="rounded-lg bg-surface-subtle">
              <CardContent className="flex flex-col gap-1 p-4">
                <h2 className="font-heading text-section-title font-semibold">
                  {t('emptySearchTitle')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('emptySearchDescription')}
                </p>
              </CardContent>
            </Card>
          ) : null}
        </section>
      ) : null}
    </AppLayout>
  );
}

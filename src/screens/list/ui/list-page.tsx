import { useEffect, useMemo, useState } from 'react';

import { CurrencyCard } from '@/entities/currency';
import {
  fxapiService,
  useFxapiCacheStore,
  type FxapiLatestRatesResponse,
} from '@/entities/fxapi';
import { useLocale, useTranslations } from '@/i18n';
import { RefreshCcwIcon } from '@/shared/icons';
import { Badge, Button, Card, CardContent, Skeleton } from '@/shared/ui';
import { AppLayout } from '@/widgets/app-shell';

const BASE_CURRENCY = 'USD';

type ListStatus =
  | { state: 'loading' }
  | { state: 'error'; message: string }
  | { state: 'ready'; data: FxapiLatestRatesResponse };

export function ListPage() {
  const locale = useLocale();
  const t = useTranslations('List');
  const [status, setStatus] = useState<ListStatus>({ state: 'loading' });
  const isCacheHydrated = useFxapiCacheStore((state) => state.isHydrated);
  const cacheLatestRates = useFxapiCacheStore(
    (state) => state.cacheLatestRates,
  );

  useEffect(() => {
    if (!isCacheHydrated) {
      return;
    }

    const controller = new AbortController();
    const cachedRates = useFxapiCacheStore
      .getState()
      .getCachedLatestRates(BASE_CURRENCY);

    if (cachedRates) {
      setStatus({ state: 'ready', data: cachedRates.data });
    } else {
      setStatus({ state: 'loading' });
    }

    fxapiService
      .getLatestRates(BASE_CURRENCY, { signal: controller.signal })
      .then((data) => {
        cacheLatestRates(data);
        setStatus({ state: 'ready', data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        const fallbackRates = useFxapiCacheStore
          .getState()
          .getCachedLatestRates(BASE_CURRENCY);

        if (fallbackRates) {
          setStatus({ state: 'ready', data: fallbackRates.data });
          return;
        }

        setStatus({
          state: 'error',
          message: error instanceof Error ? error.message : t('errorBody'),
        });
      });

    return () => controller.abort();
  }, [cacheLatestRates, isCacheHydrated, t]);

  const rates = useMemo(() => {
    if (status.state !== 'ready') {
      return [];
    }

    return Object.entries(status.data.rates).sort(([left], [right]) =>
      left.localeCompare(right),
    );
  }, [status]);

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
                  status.state === 'ready' ? status.data.base : BASE_CURRENCY,
              })}
            </p>
          </div>
          <Badge variant="outline">
            {status.state === 'ready' ? status.data.base : BASE_CURRENCY}
          </Badge>
        </div>
        {updatedAt ? (
          <p className="text-xs text-muted-foreground">
            {t('updatedAt', { value: updatedAt })}
          </p>
        ) : null}
      </section>

      {status.state === 'loading' ? (
        <section className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="rounded-md">
              <CardContent className="flex items-center gap-3 p-3">
                <Skeleton className="size-[var(--currency-avatar-size)] rounded-full" />
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
          {rates.map(([code, rate]) => (
            <CurrencyCard
              key={code}
              code={code}
              description={t('rateLabel', { base: status.data.base, code })}
              rate={rate}
            />
          ))}
        </section>
      ) : null}
    </AppLayout>
  );
}

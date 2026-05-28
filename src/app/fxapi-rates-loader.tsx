import { useEffect } from 'react';

import {
  DEFAULT_TARGET_CURRENCY,
  fxapiService,
  useFxapiCacheStore,
} from '@/entities/fxapi';

export function FxapiRatesLoader() {
  const isCacheHydrated = useFxapiCacheStore((state) => state.isHydrated);
  const targetCurrencyCode = useFxapiCacheStore(
    (state) => state.targetCurrencyCode ?? DEFAULT_TARGET_CURRENCY,
  );
  const cacheLatestRates = useFxapiCacheStore((state) => state.cacheLatestRates);
  const setLatestRatesLoading = useFxapiCacheStore(
    (state) => state.setLatestRatesLoading,
  );
  const setLatestRatesError = useFxapiCacheStore(
    (state) => state.setLatestRatesError,
  );

  useEffect(() => {
    if (!isCacheHydrated) {
      return;
    }

    const controller = new AbortController();

    setLatestRatesLoading(targetCurrencyCode, true);
    setLatestRatesError(targetCurrencyCode, undefined);

    fxapiService
      .getLatestRates(targetCurrencyCode, { signal: controller.signal })
      .then((data) => {
        cacheLatestRates(data);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setLatestRatesError(
          targetCurrencyCode,
          error instanceof Error ? error.message : 'Failed to load rates',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLatestRatesLoading(targetCurrencyCode, false);
        }
      });

    return () => controller.abort();
  }, [
    cacheLatestRates,
    isCacheHydrated,
    setLatestRatesError,
    setLatestRatesLoading,
    targetCurrencyCode,
  ]);

  return null;
}

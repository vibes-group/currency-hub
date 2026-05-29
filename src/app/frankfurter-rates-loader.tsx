import { useEffect } from 'react';

import {
  DEFAULT_TARGET_CURRENCY,
  frankfurterService,
  useFrankfurterCacheStore,
} from '@/entities/frankfurter';

export function FrankfurterRatesLoader() {
  const isCacheHydrated = useFrankfurterCacheStore(
    (state) => state.isHydrated,
  );
  const targetCurrencyCode = useFrankfurterCacheStore(
    (state) => state.targetCurrencyCode ?? DEFAULT_TARGET_CURRENCY,
  );
  const cacheLatestRates = useFrankfurterCacheStore(
    (state) => state.cacheLatestRates,
  );
  const setLatestRatesLoading = useFrankfurterCacheStore(
    (state) => state.setLatestRatesLoading,
  );
  const setLatestRatesError = useFrankfurterCacheStore(
    (state) => state.setLatestRatesError,
  );

  useEffect(() => {
    if (!isCacheHydrated) {
      return;
    }

    const controller = new AbortController();

    setLatestRatesLoading(targetCurrencyCode, true);
    setLatestRatesError(targetCurrencyCode, undefined);

    frankfurterService
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

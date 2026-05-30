import { useCallback } from 'react';

import {
  frankfurterService,
  type FrankfurterCurrencyCode,
  useFrankfurterCacheStore,
} from '@/entities/frankfurter';

export function useRefreshLatestRates(base: FrankfurterCurrencyCode) {
  const cacheLatestRates = useFrankfurterCacheStore(
    (state) => state.cacheLatestRates,
  );
  const setLatestRatesLoading = useFrankfurterCacheStore(
    (state) => state.setLatestRatesLoading,
  );
  const setLatestRatesError = useFrankfurterCacheStore(
    (state) => state.setLatestRatesError,
  );

  return useCallback(async () => {
    setLatestRatesLoading(base, true);
    setLatestRatesError(base, undefined);

    try {
      const data = await frankfurterService.getLatestRates(base);
      cacheLatestRates(data);
    } catch (error) {
      setLatestRatesError(
        base,
        error instanceof Error ? error.message : 'Failed to refresh rates',
      );
    } finally {
      setLatestRatesLoading(base, false);
    }
  }, [base, cacheLatestRates, setLatestRatesError, setLatestRatesLoading]);
}

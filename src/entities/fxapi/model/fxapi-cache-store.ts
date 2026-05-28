import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { indexedDbStorage } from '@/shared/lib';

import type {
  FxapiCurrencyCode,
  FxapiLatestRatesResponse,
} from './fxapi';

export type FxapiLatestRatesCacheRecord = {
  data: FxapiLatestRatesResponse;
  cachedAt: string;
};

type FxapiCacheState = {
  isHydrated: boolean;
  latestRatesByBase: Record<FxapiCurrencyCode, FxapiLatestRatesCacheRecord>;
  cacheLatestRates: (data: FxapiLatestRatesResponse) => void;
  getCachedLatestRates: (
    base: FxapiCurrencyCode,
  ) => FxapiLatestRatesCacheRecord | undefined;
  setHydrated: (isHydrated: boolean) => void;
};

function normalizeCurrencyCode(code: FxapiCurrencyCode) {
  return code.trim().toUpperCase();
}

export const useFxapiCacheStore = create<FxapiCacheState>()(
  persist(
    (set, get) => ({
      isHydrated: false,
      latestRatesByBase: {},
      cacheLatestRates: (data) => {
        const base = normalizeCurrencyCode(data.base);

        set((state) => ({
          latestRatesByBase: {
            ...state.latestRatesByBase,
            [base]: {
              data: {
                ...data,
                base,
              },
              cachedAt: new Date().toISOString(),
            },
          },
        }));
      },
      getCachedLatestRates: (base) =>
        get().latestRatesByBase[normalizeCurrencyCode(base)],
      setHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: 'currency-hub:fxapi-cache',
      storage: createJSONStorage(() => indexedDbStorage),
      partialize: (state) => ({
        latestRatesByBase: state.latestRatesByBase,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

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
  favoriteCurrencyCodes: FxapiCurrencyCode[];
  targetCurrencyCode: FxapiCurrencyCode | null;
  cacheLatestRates: (data: FxapiLatestRatesResponse) => void;
  getCachedLatestRates: (
    base: FxapiCurrencyCode,
  ) => FxapiLatestRatesCacheRecord | undefined;
  isFavoriteCurrency: (code: FxapiCurrencyCode) => boolean;
  toggleFavoriteCurrency: (code: FxapiCurrencyCode) => void;
  setTargetCurrency: (code: FxapiCurrencyCode) => void;
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
      favoriteCurrencyCodes: [],
      targetCurrencyCode: null,
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
      isFavoriteCurrency: (code) =>
        get().favoriteCurrencyCodes.includes(normalizeCurrencyCode(code)),
      toggleFavoriteCurrency: (code) => {
        const normalizedCode = normalizeCurrencyCode(code);

        set((state) => {
          const isFavorite =
            state.favoriteCurrencyCodes.includes(normalizedCode);

          return {
            favoriteCurrencyCodes: isFavorite
              ? state.favoriteCurrencyCodes.filter(
                  (currencyCode) => currencyCode !== normalizedCode,
                )
              : [...state.favoriteCurrencyCodes, normalizedCode].sort(),
          };
        });
      },
      setTargetCurrency: (code) =>
        set({ targetCurrencyCode: normalizeCurrencyCode(code) }),
      setHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: 'currency-hub:fxapi-cache',
      storage: createJSONStorage(() => indexedDbStorage),
      partialize: (state) => ({
        latestRatesByBase: state.latestRatesByBase,
        favoriteCurrencyCodes: state.favoriteCurrencyCodes,
        targetCurrencyCode: state.targetCurrencyCode,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

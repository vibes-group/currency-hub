import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { indexedDbStorage } from '@/shared/lib';

import type {
  FxapiCurrencyCode,
  FxapiLatestRatesResponse,
} from './fxapi';

export const DEFAULT_TARGET_CURRENCY: FxapiCurrencyCode = 'USD';

export type FxapiLatestRatesCacheRecord = {
  data: FxapiLatestRatesResponse;
  cachedAt: string;
};

type FxapiCacheState = {
  isHydrated: boolean;
  latestRatesByBase: Record<FxapiCurrencyCode, FxapiLatestRatesCacheRecord>;
  latestRatesLoadingByBase: Record<FxapiCurrencyCode, boolean>;
  latestRatesErrorsByBase: Record<FxapiCurrencyCode, string | undefined>;
  favoriteCurrencyCodes: FxapiCurrencyCode[];
  targetCurrencyCode: FxapiCurrencyCode | null;
  cacheLatestRates: (data: FxapiLatestRatesResponse) => void;
  getCachedLatestRates: (
    base: FxapiCurrencyCode,
  ) => FxapiLatestRatesCacheRecord | undefined;
  setLatestRatesLoading: (
    base: FxapiCurrencyCode,
    isLoading: boolean,
  ) => void;
  setLatestRatesError: (
    base: FxapiCurrencyCode,
    message: string | undefined,
  ) => void;
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
      latestRatesLoadingByBase: {},
      latestRatesErrorsByBase: {},
      favoriteCurrencyCodes: [],
      targetCurrencyCode: DEFAULT_TARGET_CURRENCY,
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
          latestRatesErrorsByBase: {
            ...state.latestRatesErrorsByBase,
            [base]: undefined,
          },
        }));
      },
      getCachedLatestRates: (base) =>
        get().latestRatesByBase[normalizeCurrencyCode(base)],
      setLatestRatesLoading: (base, isLoading) => {
        const normalizedCode = normalizeCurrencyCode(base);

        set((state) => ({
          latestRatesLoadingByBase: {
            ...state.latestRatesLoadingByBase,
            [normalizedCode]: isLoading,
          },
        }));
      },
      setLatestRatesError: (base, message) => {
        const normalizedCode = normalizeCurrencyCode(base);

        set((state) => ({
          latestRatesErrorsByBase: {
            ...state.latestRatesErrorsByBase,
            [normalizedCode]: message,
          },
        }));
      },
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
        if (state && !state.targetCurrencyCode) {
          state.setTargetCurrency(DEFAULT_TARGET_CURRENCY);
        }

        state?.setHydrated(true);
      },
    },
  ),
);

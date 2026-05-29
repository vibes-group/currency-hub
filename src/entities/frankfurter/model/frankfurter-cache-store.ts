import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { indexedDbStorage } from '@/shared/lib';

import type {
  FrankfurterCurrencyCode,
  FrankfurterLatestRatesResponse,
} from './frankfurter';

export const DEFAULT_TARGET_CURRENCY: FrankfurterCurrencyCode = 'USD';

export type FrankfurterLatestRatesCacheRecord = {
  data: FrankfurterLatestRatesResponse;
  cachedAt: string;
};

type FrankfurterCacheState = {
  isHydrated: boolean;
  latestRatesByBase: Record<
    FrankfurterCurrencyCode,
    FrankfurterLatestRatesCacheRecord
  >;
  latestRatesLoadingByBase: Record<FrankfurterCurrencyCode, boolean>;
  latestRatesErrorsByBase: Record<FrankfurterCurrencyCode, string | undefined>;
  favoriteCurrencyCodes: FrankfurterCurrencyCode[];
  targetCurrencyCode: FrankfurterCurrencyCode | null;
  cacheLatestRates: (data: FrankfurterLatestRatesResponse) => void;
  getCachedLatestRates: (
    base: FrankfurterCurrencyCode,
  ) => FrankfurterLatestRatesCacheRecord | undefined;
  setLatestRatesLoading: (
    base: FrankfurterCurrencyCode,
    isLoading: boolean,
  ) => void;
  setLatestRatesError: (
    base: FrankfurterCurrencyCode,
    message: string | undefined,
  ) => void;
  isFavoriteCurrency: (code: FrankfurterCurrencyCode) => boolean;
  toggleFavoriteCurrency: (code: FrankfurterCurrencyCode) => void;
  setTargetCurrency: (code: FrankfurterCurrencyCode) => void;
  setHydrated: (isHydrated: boolean) => void;
};

type PersistedFrankfurterCacheState = Partial<
  Pick<FrankfurterCacheState, 'favoriteCurrencyCodes' | 'targetCurrencyCode'>
>;

function normalizeCurrencyCode(code: FrankfurterCurrencyCode) {
  return code.trim().toUpperCase();
}

export const useFrankfurterCacheStore = create<FrankfurterCacheState>()(
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
      version: 2,
      storage: createJSONStorage(() => indexedDbStorage),
      partialize: (state) => ({
        latestRatesByBase: state.latestRatesByBase,
        favoriteCurrencyCodes: state.favoriteCurrencyCodes,
        targetCurrencyCode: state.targetCurrencyCode,
      }),
      migrate: (persistedState, version) => {
        if (
          version >= 2 ||
          !persistedState ||
          typeof persistedState !== 'object'
        ) {
          return persistedState as FrankfurterCacheState;
        }

        const state = persistedState as PersistedFrankfurterCacheState;

        return {
          latestRatesByBase: {},
          favoriteCurrencyCodes: state.favoriteCurrencyCodes ?? [],
          targetCurrencyCode:
            state.targetCurrencyCode ?? DEFAULT_TARGET_CURRENCY,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state && !state.targetCurrencyCode) {
          state.setTargetCurrency(DEFAULT_TARGET_CURRENCY);
        }

        state?.setHydrated(true);
      },
    },
  ),
);

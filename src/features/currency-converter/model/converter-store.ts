import { create } from 'zustand';

import { sanitizeConverterAmount } from './converter-amount';

type CurrencyConverterState = {
  amount: string;
  setAmount: (value: string) => void;
};

export const useCurrencyConverterStore = create<CurrencyConverterState>()(
  (set) => ({
    amount: '1000',
    setAmount: (value) => set({ amount: sanitizeConverterAmount(value) }),
  }),
);

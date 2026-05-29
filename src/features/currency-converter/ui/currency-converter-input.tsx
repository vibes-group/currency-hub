import {
  DEFAULT_TARGET_CURRENCY,
  useFrankfurterCacheStore,
} from '@/entities/frankfurter';
import { cn } from '@/shared/lib';

import {
  formatConverterAmount,
  sanitizeConverterAmount,
} from '../model/converter-amount';
import { useCurrencyConverterStore } from '../model/converter-store';

type CurrencyConverterInputProps = {
  className?: string;
};

export function CurrencyConverterInput({
  className,
}: CurrencyConverterInputProps) {
  const amount = useCurrencyConverterStore((state) => state.amount);
  const setAmount = useCurrencyConverterStore((state) => state.setAmount);
  const targetCurrencyCode = useFrankfurterCacheStore(
    (state) => state.targetCurrencyCode ?? DEFAULT_TARGET_CURRENCY,
  );

  return (
    <label
      className={cn(
        'flex w-full items-center gap-3 rounded-4xl bg-[#111315] px-8 py-3 shadow-(--shadow-converter)',
        'dark:bg-[#08100d]',
        className,
      )}
    >
      <input
        aria-label="Converter amount"
        className="min-w-0 flex-1 bg-transparent font-data text-3xl md:text-5xl font-bold leading-none text-white outline-none placeholder:text-white/35"
        inputMode="decimal"
        pattern="^\d+([.,]\d{0,2})?$"
        placeholder="0"
        type="text"
        value={formatConverterAmount(amount)}
        onChange={(event) => {
          setAmount(sanitizeConverterAmount(event.target.value));
        }}
      />
      <span className="flex h-16 min-w-28 shrink-0 items-center justify-center rounded-4xl border border-border bg-white px-6 font-heading text-2xl font-bold text-[#111315] shadow-inner">
        {targetCurrencyCode}
      </span>
    </label>
  );
}

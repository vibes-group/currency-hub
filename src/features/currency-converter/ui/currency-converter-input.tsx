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
        'flex w-full items-center gap-3 rounded-4xl bg-[#111315] dark:bg-accent-soft px-8 py-3 shadow-(--shadow-converter)',
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
      <span className="flex shrink-0 items-center justify-center rounded-4xl border border-border bg-white px-5 py-2 font-heading text-2xl font-bold text-[#111315] shadow-inner">
        {targetCurrencyCode}
      </span>
    </label>
  );
}

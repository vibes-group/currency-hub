import { useState } from 'react';

import {
  DEFAULT_TARGET_CURRENCY,
  useFxapiCacheStore,
} from '@/entities/fxapi';
import { cn } from '@/shared/lib';

type ConverterInputProps = {
  className?: string;
  defaultValue?: string;
};

const decimalValuePattern = /^\d*(?:[.,]\d{0,2})?$/;

function normalizeDecimalValue(value: string) {
  return value.replace(',', '.');
}

export function ConverterInput({
  className,
  defaultValue = '1000',
}: ConverterInputProps) {
  const [value, setValue] = useState(defaultValue);
  const targetCurrencyCode = useFxapiCacheStore(
    (state) => state.targetCurrencyCode ?? DEFAULT_TARGET_CURRENCY,
  );

  const handleValueChange = (nextValue: string) => {
    const normalizedValue = normalizeDecimalValue(nextValue);

    if (decimalValuePattern.test(normalizedValue)) {
      setValue(normalizedValue);
    }
  };

  return (
    <div
      className={cn(
        'flex h-24 items-center gap-3 rounded-[2rem] bg-[#101416] px-7 shadow-(--shadow-converter)',
        'dark:bg-[#080f0d]',
        className,
      )}
    >
      <input
        aria-label="Converter amount"
        className="min-w-0 flex-1 bg-transparent font-data text-[3.5rem] font-bold leading-none text-white caret-primary outline-none placeholder:text-white/30"
        inputMode="decimal"
        pattern="[0-9]*[.,]?[0-9]{0,2}"
        type="text"
        value={value}
        onChange={(event) => handleValueChange(event.target.value)}
      />
      <div className="flex h-14 min-w-24 items-center justify-center rounded-full border border-white/70 bg-white px-6 font-data text-xl font-bold text-[#101416] shadow-inner">
        {targetCurrencyCode}
      </div>
    </div>
  );
}

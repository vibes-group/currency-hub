import { useTransition } from 'react';

import { routing, type Locale, useLocale, useSetLocale } from '@/i18n';
import { GlobIcon } from '@/shared/icons';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

export function LocaleToggle() {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      onValueChange={(targetLocale) => {
        if (!routing.locales.includes(targetLocale as Locale)) {
          return;
        }

        startTransition(() => {
          setLocale(targetLocale as Locale);
        });
      }}
      defaultValue={locale}
      disabled={isPending}
    >
      <SelectTrigger asChild>
        <Button variant={'outline'}>
          <GlobIcon />
          <SelectValue />
        </Button>
      </SelectTrigger>
      <SelectContent>
        {['ru', 'en'].map((code) => (
          <SelectItem key={code} value={code} className="text-sm">
            {code.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

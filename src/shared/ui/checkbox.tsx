import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';

import { CheckIcon, MinusIcon } from '@/shared/icons';
import { cn } from '@/shared/lib/utils';

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  size?: 'default' | 'lg';
};

function Checkbox({ className, size = 'default', ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-size={size}
      className={cn(
        'group/checkbox flex shrink-0 items-center justify-center border bg-background text-primary-foreground shadow-sm transition-all outline-none',
        'focus-visible:ring-3 focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-60',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
        'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
        'data-[size=default]:size-(--checkbox-size) data-[size=default]:rounded-sm',
        'data-[size=lg]:size-15 data-[size=lg]:rounded-[17px]',
        'dark:data-[state=checked]:text-primary-foreground dark:data-[state=indeterminate]:text-primary-foreground',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center"
      >
        <CheckIcon className="size-7 group-data-[state=indeterminate]/checkbox:hidden" />
        <MinusIcon className="hidden size-7 group-data-[state=indeterminate]/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };

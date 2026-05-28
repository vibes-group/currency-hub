import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';

import { CheckIcon, ChevronDownIcon } from '@/shared/icons';
import { cn } from '@/shared/lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

function SelectTrigger({
  asChild,
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  if (asChild) {
    return (
      <SelectPrimitive.Trigger
        asChild
        data-slot="select-trigger"
        className={className}
        {...props}
      >
        {children}
      </SelectPrimitive.Trigger>
    );
  }

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        'flex min-h-12 w-full items-center justify-between gap-3 rounded-(--radius-control) border bg-card px-4 py-2 text-left text-sm shadow-sm transition-all outline-none',
        'focus-visible:ring-3 focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-60',
        'data-placeholder:text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  portal = true,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  portal?: boolean;
}) {
  const content = (
    <SelectPrimitive.Content
      data-slot="select-content"
      position={position}
      className={cn(
        'z-50 overflow-hidden rounded-(--radius-panel) border bg-popover p-0.5 text-popover-foreground shadow-(--shadow-floating)',
        'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="flex flex-col gap-0.5">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  );

  if (!portal) {
    return content;
  }

  return <SelectPrimitive.Portal>{content}</SelectPrimitive.Portal>;
}

function SelectItem({
  className,
  children,
  description,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & {
  description?: React.ReactNode;
}) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex cursor-default select-none items-center rounded-(--radius-control) px-3 py-2 outline-none transition-colors',
        'focus:bg-accent-soft data-[state=checked]:bg-accent-soft dark:focus:bg-secondary dark:data-[state=checked]:bg-secondary',
        'data-disabled:pointer-events-none data-disabled:opacity-50 cursor-pointer',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <SelectPrimitive.ItemText>
          <span className="font-heading font-bold leading-none text-foreground">
            {children}
          </span>
        </SelectPrimitive.ItemText>
        {description ? (
          <span className="text-base font-semibold text-muted-foreground">
            {description}
          </span>
        ) : null}
      </div>
      <SelectPrimitive.ItemIndicator className="ml-2 text-primary">
        <CheckIcon className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
};

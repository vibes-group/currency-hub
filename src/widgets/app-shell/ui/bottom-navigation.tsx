import {
  ListCheckIcon,
  SettingsIcon,
  ArrowRightLeftIcon,
} from '@/shared/icons';

import { Link, usePathname, useTranslations } from '@/i18n';
import { cn } from '@/shared/lib/utils';

const navItems = [
  { href: '/', labelKey: 'convert', icon: ArrowRightLeftIcon },
  { href: '/list', labelKey: 'list', icon: ListCheckIcon },
  { href: '/settings', labelKey: 'settings', icon: SettingsIcon },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();
  const t = useTranslations('AppShell.navigation');

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div
        className={cn(
          'mx-auto h-(--bottom-nav-pill-height) w-full max-w-xl  rounded-full border p-1 shadow-(--shadow-floating) backdrop-blur-xl',
          `grid grid-cols-${navItems.length} gap-2`,
        )}
      >
        {navItems.map(({ href, labelKey, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={labelKey}
              href={href}
              className={cn(
                'flex min-w-0 flex-col items-center justify-center gap-1 rounded-full px-1  font-semibold uppercase tracking-normal text-muted-foreground transition-colors ',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isActive && 'bg-primary text-primary-foreground shadow-sm',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="size-(--bottom-tab-icon-size)" />
              <span className="truncate">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

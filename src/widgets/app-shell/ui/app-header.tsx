import { LocaleToggle } from '@/features/change-locale';
import { ThemeToggle } from '@/features/change-theme';
import { InstallPwaButton } from '@/features/install-pwa';
import { usePathname } from '@/i18n';

export function AppHeader() {
  const pathname = usePathname();
  const shouldShowActions = pathname !== '/settings';

  return (
    <header className="sticky top-0 z-30 border-b bg-background/92 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <h1 className="truncate font-heading text-title font-bold leading-ui">
              Currency Hub
            </h1>
          </div>

          {shouldShowActions ? (
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
              <InstallPwaButton />
              <LocaleToggle />
              <ThemeToggle />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

import { LocaleToggle } from '@/features/change-locale';
import { ThemeToggle } from '@/features/change-theme';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/92 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <h1 className="truncate font-heading text-title font-bold leading-ui">
              Currency Hub
            </h1>
          </div>

          <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
            <LocaleToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

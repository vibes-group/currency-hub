import { LocaleToggle } from "@/features/change-locale";
import { ThemeToggle } from "@/features/change-theme";
import { useTranslations } from "@/i18n";
import { BellIcon, SearchIcon } from "@/shared/icons";
import { Button } from "@/shared/ui";

export function AppHeader() {
  const t = useTranslations("AppShell.header");

  return (
    <header className="sticky top-0 z-30 border-b bg-background/92 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <span className="text-xs font-medium text-muted-foreground">
              {t("eyebrow")}
            </span>
            <h1 className="truncate font-heading text-title font-bold leading-ui">
              Currency Hub
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" aria-label={t("search")}>
              <SearchIcon />
            </Button>
            <Button size="icon" variant="outline" aria-label={t("alerts")}>
              <BellIcon />
            </Button>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

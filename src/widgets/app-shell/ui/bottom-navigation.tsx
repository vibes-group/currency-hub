import {
  ArrowLeftRightIcon,
  HomeIcon,
  LineChartIcon,
  SettingsIcon,
} from "@/shared/icons";

import { Link, usePathname, useTranslations } from "@/i18n";
import { cn } from "@/shared/lib/utils";

const navItems = [
  { href: "/", labelKey: "home", icon: HomeIcon },
  { href: "/list", labelKey: "rates", icon: LineChartIcon },
  { href: "/#convert", labelKey: "convert", icon: ArrowLeftRightIcon },
  { href: "/#settings", labelKey: "settings", icon: SettingsIcon },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();
  const t = useTranslations("AppShell.navigation");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/92 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
      <div className="mx-auto grid h-[var(--bottom-nav-pill-height)] w-full max-w-xl grid-cols-4 rounded-full border bg-card p-1 shadow-[var(--shadow-floating)]">
        {navItems.map(({ href, labelKey, icon: Icon }) => {
          const isActive =
            pathname === href || (pathname === "/" && labelKey === "home");

          return (
            <Link
              key={labelKey}
              href={href}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 rounded-full px-1 text-[var(--font-size-tab)] font-semibold uppercase tracking-normal text-muted-foreground transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive && "bg-primary text-primary-foreground shadow-sm",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-[var(--bottom-tab-icon-size)]" />
              <span className="truncate">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

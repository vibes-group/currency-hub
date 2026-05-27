"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { routing, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LanguagesIcon } from "@/shared/icons";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui";

export function LocaleToggle() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("LocaleToggle");
  const [isPending, startTransition] = useTransition();

  return (
    <ToggleGroup
      type="single"
      value={locale}
      onValueChange={(nextLocale) => {
        if (!routing.locales.includes(nextLocale as Locale)) {
          return;
        }

        startTransition(() => {
          router.replace(pathname, { locale: nextLocale as Locale });
        });
      }}
      variant="outline"
      spacing={0}
      aria-label={t("label")}
      disabled={isPending}
    >
      <ToggleGroupItem value="ru" aria-label={t("ru")}>
        <LanguagesIcon data-icon="inline-start" />
        RU
      </ToggleGroupItem>
      <ToggleGroupItem value="en" aria-label={t("en")}>
        EN
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

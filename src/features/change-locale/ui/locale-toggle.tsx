import { useTransition } from "react";
import { LanguagesIcon } from "@/shared/icons";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui";

export function LocaleToggle() {
  const t = useTranslations("LocaleToggle");
  const [isPending, startTransition] = useTransition();

  return (
    <ToggleGroup
      type="single"
      value={locale}
      onValueChange={(targetLocale) => {
        if (!routing.locales.includes(targetLocale as Locale)) {
          return;
        }

        startTransition(() => {
          router.replace(pathname, { locale: targetLocale as Locale });
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

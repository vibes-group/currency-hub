import {
  ArrowRightLeftIcon,
  CheckCircle2Icon,
  RefreshCcwIcon,
  WifiOffIcon,
} from "@/shared/icons";
import { useTranslations } from "next-intl";

import { AppLayout } from "@/widgets/app-shell";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui";

const currencies = [
  ["USD", "1.0000", "+0.24%"],
  ["EUR", "0.9228", "-0.08%"],
  ["GBP", "0.7859", "+0.11%"],
] as const;

export function HomePage() {
  const t = useTranslations("Home");

  return (
    <AppLayout>
      <section id="convert" className="flex flex-col gap-3">
        <Card className="overflow-hidden border-0 bg-surface-inverse text-white shadow-[var(--shadow-converter)] dark:text-text-primary">
          <CardHeader className="gap-2">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="secondary">EUR</Badge>
              <Button size="icon" aria-label={t("refresh")}>
                <RefreshCcwIcon />
              </Button>
            </div>
            <CardTitle className="font-heading text-section-title">
              {t("converterTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="font-data text-amount font-bold leading-amount">
              1 000
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 p-3">
              <div className="flex min-w-0 flex-col">
                <span className="text-xs text-white/60 dark:text-text-secondary">
                  {t("result")}
                </span>
                <span className="font-data text-result font-bold">
                  1 083.40 USD
                </span>
              </div>
              <ArrowRightLeftIcon className="size-5 text-white/60 dark:text-text-secondary" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="rates" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-section-title font-semibold">
            {t("ratesTitle")}
          </h2>
          <Badge variant="outline">
            <CheckCircle2Icon data-icon="inline-start" />
            {t("live")}
          </Badge>
        </div>

        <div className="flex flex-col gap-2">
          {currencies.map(([code, value, trend]) => (
            <Card key={code} className="rounded-md">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex size-[var(--currency-avatar-size)] items-center justify-center rounded-full bg-accent-soft font-data text-sm font-bold text-primary">
                  {code}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-data text-sm font-bold">{code}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("cachedRate")}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-data text-sm font-bold">{value}</span>
                  <Badge variant={trend.startsWith("+") ? "secondary" : "destructive"}>
                    {trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="settings">
        <Card className="rounded-lg bg-surface-subtle">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-card text-muted-foreground">
              <WifiOffIcon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-heading text-section-title font-semibold">
                {t("offlineTitle")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("offlineDescription")}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
}

import { getTranslations } from "next-intl/server";

import { getLatestRates } from "@/shared/api";
import { Badge, Card, CardContent } from "@/shared/ui";
import { AppLayout } from "@/widgets/app-shell";

type ListPageProps = {
  locale: string;
  base?: string;
};

function formatRate(locale: string, rate: number) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 6,
  }).format(rate);
}

export async function ListPage({ locale, base = "USD" }: ListPageProps) {
  const t = await getTranslations("List");
  const data = await getLatestRates(base);
  const rates = Object.entries(data.rates).sort(([left], [right]) =>
    left.localeCompare(right),
  );
  const updatedAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(data.timestamp));

  return (
    <AppLayout>
      <section className="flex flex-col gap-2">
        <Badge className="w-fit" variant="secondary">
          {t("badge")}
        </Badge>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-heading text-title font-bold leading-ui">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("description", { base: data.base })}
            </p>
          </div>
          <Badge variant="outline">{data.base}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("updatedAt", { value: updatedAt })}
        </p>
      </section>

      <section className="flex flex-col gap-2">
        {rates.map(([code, rate]) => (
          <Card key={code} className="rounded-md">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex size-[var(--currency-avatar-size)] items-center justify-center rounded-full bg-accent-soft font-data text-sm font-bold text-primary">
                {code}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-data text-sm font-bold">{code}</div>
                <div className="text-xs text-muted-foreground">
                  {t("rateLabel", { base: data.base, code })}
                </div>
              </div>
              <span className="font-data text-sm font-bold">
                {formatRate(locale, rate)}
              </span>
            </CardContent>
          </Card>
        ))}
      </section>
    </AppLayout>
  );
}

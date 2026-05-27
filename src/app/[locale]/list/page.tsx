import { setRequestLocale } from "next-intl/server";

import { ListPage } from "@/screens/list";

export const dynamic = "force-dynamic";

export default async function ListRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <ListPage locale={locale} />;
}

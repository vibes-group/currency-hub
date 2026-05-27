import { setRequestLocale } from "next-intl/server";

import { DemoPage } from "@/screens/demo";

export default async function DemoRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <DemoPage />;
}

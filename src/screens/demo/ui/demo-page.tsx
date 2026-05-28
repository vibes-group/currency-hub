import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  RefreshCcwIcon,
  SearchIcon,
  Settings2Icon,
  WifiOffIcon,
} from '@/shared/icons';

import { LocaleToggle } from '@/features/change-locale';
import { ThemeToggle } from '@/features/change-theme';
import { Link, useTranslations } from '@/i18n';
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
} from '@/shared/ui';

const tokenRows = [
  ['tokens.background', 'var(--background)'],
  ['tokens.card', 'var(--card)'],
  ['tokens.primary', 'var(--primary)'],
  ['tokens.accentSoft', 'var(--accent-soft)'],
  ['tokens.muted', 'var(--muted)'],
  ['tokens.border', 'var(--border)'],
  ['tokens.warning', 'var(--warning)'],
  ['tokens.danger', 'var(--danger)'],
] as const;

const rateCards = [
  ['USD', '1.0000', 'target', 'default'],
  ['EUR', '0.9231', '+0.18%', 'secondary'],
  ['GBP', '0.7864', '-0.12%', 'destructive'],
] as const;

const selectCurrencies = ['USD', 'EUR', 'GBP', 'JPY'] as const;

function TokenSwatches() {
  const t = useTranslations('Demo');

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tokenRows.map(([labelKey, value]) => (
        <div
          key={labelKey}
          className="flex items-center gap-3 rounded-lg border bg-card p-3"
        >
          <span
            className="size-9 rounded-md border"
            style={{ backgroundColor: value }}
          />
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-medium">{t(labelKey)}</span>
            <span className="truncate font-mono text-xs text-muted-foreground">
              {value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MobilePreview() {
  const t = useTranslations('Demo.preview');

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-4 rounded-[2rem] border bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-heading text-2xl font-bold leading-none">
            Currency Hub
          </span>
          <span className="text-sm text-muted-foreground">{t('subtitle')}</span>
        </div>
        <Button size="icon" variant="outline" aria-label={t('settings')}>
          <Settings2Icon />
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl bg-surface-inverse p-5 text-white shadow-sm dark:text-text-primary">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/60 dark:text-text-secondary">
            {t('amount')}
          </span>
          <Badge variant="secondary">EUR</Badge>
        </div>
        <div className="font-mono text-5xl font-bold tracking-normal">
          1 000
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-white/60 dark:text-text-secondary">
            1 EUR = 1.0834 USD
          </span>
          <Button size="icon" aria-label={t('refreshRate')}>
            <RefreshCcwIcon />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {['USD', 'EUR', 'GBP', 'JPY'].map((currency, index) => (
          <Button
            key={currency}
            variant={index === 0 ? 'default' : 'outline'}
            size="sm"
          >
            {currency}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {rateCards.map(([code, value, meta, variant]) => (
          <div
            key={code}
            className="flex items-center gap-3 rounded-2xl border bg-card p-3"
          >
            <div className="flex size-11 items-center justify-center rounded-full bg-accent-soft font-mono text-sm font-bold text-primary">
              {code}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="font-mono text-sm font-bold">{code}</span>
              <span className="text-xs text-muted-foreground">
                {t('cachedRate')}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-sm font-bold">{value}</span>
              <Badge variant={variant}>
                {meta === 'target' ? t('target') : meta}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormControlsPreview() {
  const t = useTranslations('Demo.form');

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Card className="rounded-[2rem] bg-surface-raised p-4">
        <CardHeader className="items-center text-center">
          <CardTitle className="font-heading text-3xl font-bold">
            {t('checkboxTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <label className="flex flex-col items-center gap-3">
              <Checkbox size="lg" />
              <span className="text-lg font-bold text-muted-foreground">
                {t('off')}
              </span>
            </label>
            <label className="flex flex-col items-center gap-3">
              <Checkbox size="lg" defaultChecked />
              <span className="text-lg font-bold text-muted-foreground">
                {t('on')}
              </span>
            </label>
            <label className="flex flex-col items-center gap-3">
              <Checkbox size="lg" defaultChecked="indeterminate" />
              <span className="text-lg font-bold text-muted-foreground">
                {t('mix')}
              </span>
            </label>
            <label className="flex flex-col items-center gap-3">
              <Checkbox size="lg" disabled />
              <span className="text-lg font-bold text-muted-foreground">
                {t('off')}
              </span>
            </label>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-[2rem] bg-surface-raised p-4">
        <CardHeader className="items-center text-center">
          <CardTitle className="font-heading text-3xl font-bold">
            {t('selectTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Select defaultValue="USD">
              <SelectTrigger>
                <SelectValue placeholder={t('selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {selectCurrencies.map((code) => (
                  <SelectItem
                    key={code}
                    value={code}
                    description={t(`currency.${code}.name`)}
                  >
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="EUR">
              <SelectTrigger asChild>
                <Button
                  className="h-12 w-full justify-between rounded-(--radius-control) px-4"
                  variant="outline"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-data font-bold">EUR</span>
                    <SelectValue placeholder={t('selectPlaceholder')} />
                  </span>
                  <ChevronDownIcon className="size-4 text-muted-foreground" />
                </Button>
              </SelectTrigger>
              <SelectContent>
                {selectCurrencies.map((code) => (
                  <SelectItem
                    key={code}
                    value={code}
                    description={t(`currency.${code}.name`)}
                  >
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function DemoPage() {
  const t = useTranslations('Demo');

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <Badge className="w-fit" variant="secondary">
              {t('badge')}
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-normal">
              {t('title')}
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              {t('description')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LocaleToggle />
            <Button asChild>
              <Link href="/demo#mobile-preview">
                {t('mobilePreviewButton')}
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </header>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-2xl font-semibold">
              {t('tokensTitle')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('tokensDescription')}
            </p>
          </div>
          <TokenSwatches />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl font-semibold">
              {t('buttonsTitle')}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button>{t('button.primary')}</Button>
              <Button variant="secondary">{t('button.secondary')}</Button>
              <Button variant="outline">{t('button.outline')}</Button>
              <Button variant="ghost">{t('button.ghost')}</Button>
              <Button variant="destructive">{t('button.destructive')}</Button>
              <Button size="icon" aria-label="Search">
                <SearchIcon />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs">{t('button.extraSmall')}</Button>
              <Button size="sm">{t('button.small')}</Button>
              <Button>{t('button.default')}</Button>
              <Button size="lg">{t('button.large')}</Button>
              <Button disabled>{t('button.disabled')}</Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl font-semibold">
              {t('controlsTitle')}
            </h2>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder={t('searchPlaceholder')} />
              </div>
              <ThemeToggle />
            </div>
          </div>
        </section>

        <Separator />

        <FormControlsPreview />

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t('cards.rateTitle')}</CardTitle>
              <CardDescription>{t('cards.rateDescription')}</CardDescription>
              <CardAction>
                <Badge>
                  <CheckIcon data-icon="inline-start" />
                  {t('cards.live')}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-3xl font-bold">1.0834</span>
                  <span className="text-sm text-muted-foreground">
                    EUR / USD
                  </span>
                </div>
                <Badge variant="secondary">+0.18%</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-sm text-muted-foreground">
                {t('cards.updated')}
              </span>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('cards.offlineTitle')}</CardTitle>
              <CardDescription>{t('cards.offlineDescription')}</CardDescription>
              <CardAction>
                <WifiOffIcon className="text-muted-foreground" />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{t('cards.stale')}</Badge>
                <Badge variant="secondary">{t('cards.indexedDb')}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('cards.offlineBody')}
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline">
                <RefreshCcwIcon data-icon="inline-start" />
                {t('cards.retrySync')}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('cards.loadingTitle')}</CardTitle>
              <CardDescription>{t('cards.loadingDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-12 w-full" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
              </div>
            </CardContent>
            <CardFooter>
              <Badge variant="outline">{t('cards.pending')}</Badge>
            </CardFooter>
          </Card>
        </section>

        <section
          id="mobile-preview"
          className="grid items-start gap-6 lg:grid-cols-2"
        >
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl font-semibold">
              {t('preview.mobileTitle')}
            </h2>
            <MobilePreview />
          </div>

          <div className="dark flex flex-col gap-4 rounded-3xl bg-background p-4 text-foreground">
            <h2 className="font-heading text-2xl font-semibold">
              {t('preview.darkTitle')}
            </h2>
            <MobilePreview />
          </div>
        </section>
      </div>
    </main>
  );
}

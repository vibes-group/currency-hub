import {
  ArrowRightIcon,
  CheckIcon,
  RefreshCcwIcon,
  SearchIcon,
  Settings2Icon,
  WifiOffIcon,
} from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/features/change-theme";
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
  Input,
  Separator,
  Skeleton,
} from "@/shared/ui";

const tokens = [
  ["Background", "var(--background)"],
  ["Card", "var(--card)"],
  ["Primary", "var(--primary)"],
  ["Accent soft", "var(--accent-soft)"],
  ["Muted", "var(--muted)"],
  ["Border", "var(--border)"],
  ["Warning", "var(--warning)"],
  ["Danger", "var(--danger)"],
] as const;

const rateCards = [
  ["USD", "1.0000", "Target", "default"],
  ["EUR", "0.9231", "+0.18%", "secondary"],
  ["GBP", "0.7864", "-0.12%", "destructive"],
] as const;

function TokenSwatches() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tokens.map(([label, value]) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-lg border bg-card p-3"
        >
          <span
            className="size-9 rounded-md border"
            style={{ backgroundColor: value }}
          />
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-medium">{label}</span>
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
  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-4 rounded-[2rem] border bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-heading text-2xl font-bold leading-none">
            Currency Hub
          </span>
          <span className="text-sm text-muted-foreground">
            Mobile PWA foundation
          </span>
        </div>
        <Button size="icon" variant="outline" aria-label="Settings">
          <Settings2Icon />
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl bg-surface-inverse p-5 text-white shadow-sm dark:text-text-primary">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/60 dark:text-text-secondary">
            Amount
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
          <Button size="icon" aria-label="Refresh rate">
            <RefreshCcwIcon />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {["USD", "EUR", "GBP", "JPY"].map((currency, index) => (
          <Button
            key={currency}
            variant={index === 0 ? "default" : "outline"}
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
                Cached exchange rate
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-sm font-bold">{value}</span>
              <Badge variant={variant}>{meta}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DemoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <Badge className="w-fit" variant="secondary">
              UI foundation
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-normal">
              Currency Hub primitives
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Tailwind tokens and shadcn primitives adapted to the mobile
              currency design language.
            </p>
          </div>
          <Button asChild>
            <Link href="/demo#mobile-preview">
              Mobile preview
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </header>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-2xl font-semibold">Tokens</h2>
            <p className="text-sm text-muted-foreground">
              Core CSS variables exposed as Tailwind v4 theme tokens.
            </p>
          </div>
          <TokenSwatches />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl font-semibold">Buttons</h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button size="icon" aria-label="Search">
                <SearchIcon />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs">Extra small</Button>
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl font-semibold">Controls</h2>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search currency or code" />
              </div>
              <ThemeToggle />
            </div>
          </div>
        </section>

        <Separator />

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Rate card</CardTitle>
              <CardDescription>Compact financial metric</CardDescription>
              <CardAction>
                <Badge>
                  <CheckIcon data-icon="inline-start" />
                  Live
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
                Updated 18 sec ago
              </span>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Offline state</CardTitle>
              <CardDescription>Cached data fallback</CardDescription>
              <CardAction>
                <WifiOffIcon className="text-muted-foreground" />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Stale</Badge>
                <Badge variant="secondary">IndexedDB</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Last cached rates remain readable when the device is offline.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline">
                <RefreshCcwIcon data-icon="inline-start" />
                Retry sync
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loading state</CardTitle>
              <CardDescription>Skeleton primitives</CardDescription>
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
              <Badge variant="outline">Pending</Badge>
            </CardFooter>
          </Card>
        </section>

        <section
          id="mobile-preview"
          className="grid items-start gap-6 lg:grid-cols-2"
        >
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl font-semibold">
              Mobile preview
            </h2>
            <MobilePreview />
          </div>

          <div className="dark flex flex-col gap-4 rounded-3xl bg-background p-4 text-foreground">
            <h2 className="font-heading text-2xl font-semibold">
              Dark preview
            </h2>
            <MobilePreview />
          </div>
        </section>
      </div>
    </main>
  );
}

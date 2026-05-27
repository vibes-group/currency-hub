import type { ReactNode } from "react";

import { AppHeader } from "./app-header";
import { BottomNavigation } from "./bottom-navigation";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 pb-[calc(var(--bottom-bar-height)+1.5rem)] pt-4">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}

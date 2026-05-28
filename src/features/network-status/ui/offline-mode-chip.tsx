import { WifiOffIcon } from '@/shared/icons';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui';

import { useNetworkStatus } from '../model/use-network-status';

export function OfflineModeChip({ className }: { className?: string }) {
  const { isOffline } = useNetworkStatus();

  if (!isOffline) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-[calc(var(--bottom-nav-pill-height)+0.75rem)] z-40 flex justify-center px-4 md:bottom-[calc(var(--bottom-nav-pill-height)+1.75rem)]',
        className,
      )}
    >
      <Badge
        variant="destructive"
        className="p-3 text-sm font-semibold shadow-(--shadow-floating) backdrop-blur-lg"
      >
        <WifiOffIcon data-icon="inline-start" />
        offline mode
      </Badge>
    </div>
  );
}

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from 'react';

import { RefreshCcwIcon } from '@/shared/icons';
import { cn } from '@/shared/lib';

const REFRESH_THRESHOLD = 64;
const MAX_PULL_DISTANCE = 84;

type PullToRefreshProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onRefresh: () => Promise<void> | void;
};

export function PullToRefresh({
  children,
  className,
  disabled = false,
  onRefresh,
}: PullToRefreshProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number | null>(null);
  const pullDistanceRef = useRef(0);
  const disabledRef = useRef(disabled);
  const isRefreshingRef = useRef(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const updatePullDistance = (value: number) => {
    pullDistanceRef.current = value;
    setPullDistance(value);
  };

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  useEffect(() => {
    isRefreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const handleNativeTouchMove = (event: TouchEvent) => {
      if (
        disabledRef.current ||
        isRefreshingRef.current ||
        touchStartY.current === null ||
        window.scrollY > 0
      ) {
        return;
      }

      const currentY = event.touches[0]?.clientY;

      if (currentY === undefined) {
        return;
      }

      const distance = currentY - touchStartY.current;

      if (distance <= 0) {
        updatePullDistance(0);
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      updatePullDistance(Math.min(distance * 0.5, MAX_PULL_DISTANCE));
    };

    root.addEventListener('touchmove', handleNativeTouchMove, {
      passive: false,
    });

    return () => {
      root.removeEventListener('touchmove', handleNativeTouchMove);
    };
  }, []);

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (disabled || isRefreshing || window.scrollY > 0) {
      touchStartY.current = null;
      return;
    }

    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = async () => {
    const shouldRefresh = pullDistanceRef.current >= REFRESH_THRESHOLD;

    touchStartY.current = null;

    if (!shouldRefresh) {
      updatePullDistance(0);
      return;
    }

    updatePullDistance(REFRESH_THRESHOLD);
    setIsRefreshing(true);

    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      updatePullDistance(0);
    }
  };

  return (
    <div
      ref={rootRef}
      data-slot="pull-to-refresh"
      className={cn('relative touch-pan-y overscroll-contain', className)}
      style={{
        transform:
          pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
        transition: isRefreshing ? undefined : 'transform 180ms ease-out',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 flex -translate-y-full justify-center pb-3 transition-opacity',
          pullDistance > 0 || isRefreshing ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div className="flex size-9 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-(--shadow-floating)">
          <RefreshCcwIcon
            className={cn(
              'size-4',
              (pullDistance >= REFRESH_THRESHOLD || isRefreshing) &&
                'animate-spin text-primary',
            )}
          />
        </div>
      </div>
      {children}
    </div>
  );
}

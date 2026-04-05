import { Skeleton } from '@/components/ui/skeleton';

export function ChartSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

import { StatsCardSkeleton } from '@/components/stats/StatsCardSkeleton';
import { ChartSkeleton } from '@/components/charts/ChartSkeleton';
import { WorkoutTableSkeleton } from '@/components/records/WorkoutTableSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* 통계 카드 스켈레톤 */}
      <section>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* 차트 스켈레톤 */}
      <section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
              <ChartSkeleton />
            </div>
          ))}
        </div>
      </section>

      {/* 테이블 스켈레톤 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <WorkoutTableSkeleton />
      </section>
    </div>
  );
}

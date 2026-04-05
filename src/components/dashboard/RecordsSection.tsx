import { Suspense } from 'react';
import { RecordsClient } from '@/components/records/RecordsClient';
import { WorkoutTableSkeleton } from '@/components/records/WorkoutTableSkeleton';
import type { WorkoutRecord } from '@/types/workout';

interface RecordsSectionProps {
  records: WorkoutRecord[];
}

export function RecordsSection({ records }: RecordsSectionProps) {
  return (
    <section aria-label="운동 기록 테이블">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">운동 기록</h2>
        <span className="text-sm text-muted-foreground">총 {records.length}건</span>
      </div>
      {/* CategoryFilter가 useSearchParams를 사용하므로 Suspense 경계 필요 */}
      <Suspense fallback={<WorkoutTableSkeleton />}>
        <RecordsClient records={records} />
      </Suspense>
    </section>
  );
}

import { fetchWorkoutRecords, fetchWorkoutRecordsByDateRange } from '@/lib/notion';
import { calcDashboardStats, groupByWeek, groupRunningByDate } from '@/lib/workout-utils';
import { StatsSection } from '@/components/dashboard/StatsSection';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { RecordsSection } from '@/components/dashboard/RecordsSection';
import { DateRangeFilter } from '@/components/records/DateRangeFilter';
import { Suspense } from 'react';

// ISR: 60초마다 재생성
export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const from = typeof params.from === 'string' ? params.from : undefined;
  const to = typeof params.to === 'string' ? params.to : undefined;

  const records =
    from && to
      ? await fetchWorkoutRecordsByDateRange(from, to)
      : await fetchWorkoutRecords();

  const stats = calcDashboardStats(records);
  const weeklyData = groupByWeek(records);
  const runningData = groupRunningByDate(records);

  return (
    <div className="space-y-8">
      <StatsSection stats={stats} />
      <ChartsSection weeklyData={weeklyData} runningData={runningData} />
      <div className="space-y-4">
        {/* 날짜 범위 필터는 useSearchParams를 사용하므로 Suspense 경계 필요 */}
        <Suspense>
          <DateRangeFilter />
        </Suspense>
        <RecordsSection records={records} />
      </div>
    </div>
  );
}

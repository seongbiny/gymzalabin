import { fetchWorkoutRecords } from '@/lib/notion';
import { calcDashboardStats, groupByWeek, groupRunningByDate } from '@/lib/workout-utils';
import { StatsSection } from '@/components/dashboard/StatsSection';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { RecordsSection } from '@/components/dashboard/RecordsSection';

// ISR: 60초마다 재생성
export const revalidate = 60;

export default async function DashboardPage() {
  const records = await fetchWorkoutRecords();
  const stats = calcDashboardStats(records);
  const weeklyData = groupByWeek(records);
  const runningData = groupRunningByDate(records);

  return (
    <div className="space-y-8">
      <StatsSection stats={stats} />
      <ChartsSection weeklyData={weeklyData} runningData={runningData} />
      <RecordsSection records={records} />
    </div>
  );
}

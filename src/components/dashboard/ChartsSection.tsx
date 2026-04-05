import { WeeklyVolumeChart } from '@/components/charts/WeeklyVolumeChart';
import { RunningDistanceChart } from '@/components/charts/RunningDistanceChart';
import type { WeeklyVolumeData, RunningDistanceData } from '@/types/workout';

interface ChartsSectionProps {
  weeklyData: WeeklyVolumeData;
  runningData: RunningDistanceData;
}

export function ChartsSection({ weeklyData, runningData }: ChartsSectionProps) {
  return (
    <section aria-label="운동 차트" className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold">주간 볼륨 추이</h2>
          <WeeklyVolumeChart data={weeklyData} />
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold">러닝 거리 기록</h2>
          {runningData.labels.length > 0 ? (
            <RunningDistanceChart data={runningData} />
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              러닝 기록이 없습니다
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

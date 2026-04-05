import { Activity, Dumbbell, MapPin, Trophy } from 'lucide-react';
import { StatsCard } from '@/components/stats/StatsCard';
import type { DashboardStats } from '@/types/workout';

interface StatsSectionProps {
  stats: DashboardStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const { weeklyVolume, personalRecord, cumulativeDistance, workoutDays } = stats;

  // PR 표시 문자열 생성
  const prValue = personalRecord
    ? `${personalRecord.value.toLocaleString()} ${personalRecord.unit}`
    : '-';
  const prDescription = personalRecord ? personalRecord.name : '기록 없음';

  return (
    <section aria-label="운동 통계">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard
          title="주간 볼륨"
          value={weeklyVolume > 0 ? `${weeklyVolume.toLocaleString()} kg` : '-'}
          description="이번 주 총 운동량"
          icon={Dumbbell}
        />
        <StatsCard
          title="최고 기록 (PR)"
          value={prValue}
          description={prDescription}
          icon={Trophy}
        />
        <StatsCard
          title="누적 거리"
          value={`${cumulativeDistance.toFixed(1)} km`}
          description="러닝 총 누적 거리"
          icon={MapPin}
        />
        <StatsCard
          title="운동 일수"
          value={`${workoutDays}일`}
          description="총 운동한 날 수"
          icon={Activity}
        />
      </div>
    </section>
  );
}

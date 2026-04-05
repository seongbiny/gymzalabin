import type {
  WorkoutRecord,
  WorkoutCategory,
  DashboardStats,
  PRRecord,
  WeeklyVolumeData,
  RunningDistanceData,
} from '@/types/workout';

/**
 * 이번 주 월요일 날짜를 반환 (YYYY-MM-DD)
 */
function getThisWeekMonday(): Date {
  const now = new Date();
  const day = now.getDay();
  // 일요일(0)은 -6, 나머지는 1-day
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * 이번 주 일요일 날짜를 반환
 */
function getThisWeekSunday(): Date {
  const monday = getThisWeekMonday();
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
}

/**
 * 이번 주 웨이트 총 볼륨 계산 (무게 × 세트 × 반복)
 */
export function calcWeeklyVolume(records: WorkoutRecord[]): number {
  const monday = getThisWeekMonday();
  const sunday = getThisWeekSunday();

  return records
    .filter((r) => {
      if (r.category !== '웨이트' || !r.date) return false;
      const date = new Date(r.date);
      return date >= monday && date <= sunday;
    })
    .reduce((sum, r) => {
      const weight = r.weightKg ?? 0;
      const sets = r.sets ?? 0;
      const reps = r.reps ?? 0;
      return sum + weight * sets * reps;
    }, 0);
}

/**
 * 종목별 최고 기록(PR) 반환
 */
export function calcPersonalRecord(records: WorkoutRecord[]): PRRecord | null {
  if (records.length === 0) return null;

  // 웨이트 PR: 가장 무거운 무게
  const weightRecords = records.filter(
    (r) => r.category === '웨이트' && r.weightKg !== null
  );

  // 러닝 PR: 가장 긴 거리
  const runningRecords = records.filter(
    (r) => r.category === '러닝' && r.weightKg !== null
  );

  let pr: PRRecord | null = null;

  if (weightRecords.length > 0) {
    const best = weightRecords.reduce((prev, curr) =>
      (curr.weightKg ?? 0) > (prev.weightKg ?? 0) ? curr : prev
    );
    pr = { name: best.name, value: best.weightKg ?? 0, unit: 'kg' };
  }

  if (runningRecords.length > 0) {
    const bestRun = runningRecords.reduce((prev, curr) =>
      (curr.weightKg ?? 0) > (prev.weightKg ?? 0) ? curr : prev
    );
    // 러닝 PR이 웨이트 PR보다 더 최근이면 교체 (단순하게 마지막 기록 우선)
    if (!pr) {
      pr = { name: bestRun.name, value: bestRun.weightKg ?? 0, unit: 'km' };
    }
  }

  return pr;
}

/**
 * 러닝 누적 거리(km) 계산
 */
export function calcCumulativeDistance(records: WorkoutRecord[]): number {
  return records
    .filter((r) => r.category === '러닝' && r.weightKg !== null)
    .reduce((sum, r) => sum + (r.weightKg ?? 0), 0);
}

/**
 * 기간 내 운동한 날 수 (중복 제거)
 */
export function calcWorkoutDays(records: WorkoutRecord[]): number {
  const uniqueDates = new Set(records.map((r) => r.date).filter(Boolean));
  return uniqueDates.size;
}

/**
 * 전체 통계 한번에 계산
 */
export function calcDashboardStats(records: WorkoutRecord[]): DashboardStats {
  return {
    weeklyVolume: calcWeeklyVolume(records),
    personalRecord: calcPersonalRecord(records),
    cumulativeDistance: calcCumulativeDistance(records),
    workoutDays: calcWorkoutDays(records),
  };
}

/**
 * 최근 8주 주간 웨이트 볼륨 그룹핑
 */
export function groupByWeek(records: WorkoutRecord[]): WeeklyVolumeData {
  const weeks: { label: string; start: Date; end: Date }[] = [];
  const now = new Date();

  for (let i = 7; i >= 0; i--) {
    const monday = getThisWeekMonday();
    monday.setDate(monday.getDate() - i * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const month = monday.getMonth() + 1;
    const day = monday.getDate();
    weeks.push({ label: `${month}/${day}`, start: monday, end: sunday });
  }

  const volumes = weeks.map(({ start, end }) => {
    return records
      .filter((r) => {
        if (r.category !== '웨이트' || !r.date) return false;
        const date = new Date(r.date);
        return date >= start && date <= end;
      })
      .reduce((sum, r) => {
        const weight = r.weightKg ?? 0;
        const sets = r.sets ?? 0;
        const reps = r.reps ?? 0;
        return sum + weight * sets * reps;
      }, 0);
  });

  return {
    labels: weeks.map((w) => w.label),
    volumes,
  };
}

/**
 * 최근 30일 러닝 거리 날짜별 그룹핑
 */
export function groupRunningByDate(records: WorkoutRecord[]): RunningDistanceData {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const runningRecords = records
    .filter((r) => {
      if (r.category !== '러닝' || !r.date) return false;
      const date = new Date(r.date);
      return date >= thirtyDaysAgo;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  // 날짜별 합산
  const dateMap = new Map<string, number>();
  for (const r of runningRecords) {
    const current = dateMap.get(r.date) ?? 0;
    dateMap.set(r.date, current + (r.weightKg ?? 0));
  }

  const labels: string[] = [];
  const distances: number[] = [];

  for (const [date, distance] of dateMap.entries()) {
    const d = new Date(date);
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
    distances.push(distance);
  }

  return { labels, distances };
}

/**
 * 카테고리 필터링
 */
export function filterByCategory(
  records: WorkoutRecord[],
  category: WorkoutCategory | '전체'
): WorkoutRecord[] {
  if (category === '전체') return records;
  return records.filter((r) => r.category === category);
}

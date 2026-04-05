// 운동 카테고리 타입
export type WorkoutCategory = '웨이트' | '러닝';

// 운동 루틴 타입
export type WorkoutRoutine = '가슴' | '등' | '하체' | '어깨' | '팔' | '전신' | '-';

// Notion DB 단일 레코드 (파싱 후)
export interface WorkoutRecord {
  id: string;
  name: string;
  date: string;              // YYYY-MM-DD
  category: WorkoutCategory;
  routine: WorkoutRoutine;
  weightKg: number | null;   // 웨이트: 사용 무게(kg), 러닝: 거리(km)
  sets: number | null;       // 세트 수 (웨이트 전용)
  reps: number | null;       // 반복 횟수 (웨이트 전용)
  memo: string;
}

// 대시보드 통계 지표
export interface DashboardStats {
  weeklyVolume: number;          // 이번 주 총 볼륨 (무게 × 세트 × 반복)
  personalRecord: PRRecord | null;
  cumulativeDistance: number;    // 러닝 누적 km
  workoutDays: number;           // 기간 내 운동한 날 수
}

// 개인 최고 기록
export interface PRRecord {
  name: string;
  value: number;
  unit: 'kg' | 'km';
}

// 주간 볼륨 차트 데이터
export interface WeeklyVolumeData {
  labels: string[];   // 날짜 레이블 (예: '3/30', '3/31')
  volumes: number[];
}

// 러닝 거리 차트 데이터
export interface RunningDistanceData {
  labels: string[];   // 날짜 레이블
  distances: number[];
}

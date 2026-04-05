// 차트 공통 색상 및 테마 설정
export const CHART_COLORS = {
  weight: {
    background: 'rgba(99, 102, 241, 0.6)',  // indigo-500
    border: 'rgb(99, 102, 241)',
    hover: 'rgba(99, 102, 241, 0.8)',
  },
  running: {
    background: 'rgba(16, 185, 129, 0.4)',  // emerald-500
    border: 'rgb(16, 185, 129)',
    hover: 'rgba(16, 185, 129, 0.6)',
  },
} as const;

// 공통 폰트 설정
export const CHART_FONT = {
  family: "'Noto Sans KR', sans-serif",
  size: 12,
} as const;

'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CHART_COLORS, CHART_FONT } from './chartConfig';
import type { RunningDistanceData } from '@/types/workout';

// 필요한 요소만 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RunningDistanceChartProps {
  data: RunningDistanceData;
}

export function RunningDistanceChart({ data }: RunningDistanceChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: '러닝 거리 (km)',
        data: data.distances,
        backgroundColor: CHART_COLORS.running.background,
        borderColor: CHART_COLORS.running.border,
        borderWidth: 2,
        pointBackgroundColor: CHART_COLORS.running.border,
        pointRadius: 4,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: CHART_FONT },
      },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { y: number | null } }) => {
            const y = ctx.parsed.y ?? 0;
            return ` ${y.toFixed(1)} km`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: CHART_FONT,
          callback: (value: number | string) =>
            typeof value === 'number' ? `${value} km` : value,
        },
      },
      x: {
        ticks: { font: CHART_FONT },
      },
    },
  };

  return (
    <div
      role="img"
      aria-label="러닝 거리 라인 차트"
      className="relative h-64"
    >
      <Line options={options} data={chartData} />
    </div>
  );
}

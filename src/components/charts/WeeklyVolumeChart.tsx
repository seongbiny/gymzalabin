'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CHART_COLORS, CHART_FONT } from './chartConfig';
import type { WeeklyVolumeData } from '@/types/workout';

// 필요한 요소만 등록 (tree-shaking)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface WeeklyVolumeChartProps {
  data: WeeklyVolumeData;
}

export function WeeklyVolumeChart({ data }: WeeklyVolumeChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: '주간 볼륨 (kg)',
        data: data.volumes,
        backgroundColor: CHART_COLORS.weight.background,
        borderColor: CHART_COLORS.weight.border,
        borderWidth: 1,
        hoverBackgroundColor: CHART_COLORS.weight.hover,
        borderRadius: 4,
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
            return ` ${y.toLocaleString()} kg`;
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
            typeof value === 'number' ? `${value.toLocaleString()}` : value,
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
      aria-label="주간 웨이트 볼륨 바 차트"
      className="relative h-64"
    >
      <Bar options={options} data={chartData} />
    </div>
  );
}

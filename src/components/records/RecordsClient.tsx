'use client';

import { useSearchParams } from 'next/navigation';
import { CategoryFilter } from './CategoryFilter';
import { WorkoutTable } from './WorkoutTable';
import { filterByCategory } from '@/lib/workout-utils';
import type { WorkoutRecord, WorkoutCategory } from '@/types/workout';

interface RecordsClientProps {
  records: WorkoutRecord[];
}

export function RecordsClient({ records }: RecordsClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  // URL 파라미터 유효성 검증
  const validCategories: WorkoutCategory[] = ['웨이트', '러닝'];
  const category =
    categoryParam && validCategories.includes(categoryParam as WorkoutCategory)
      ? (categoryParam as WorkoutCategory)
      : '전체';

  const filteredRecords = filterByCategory(records, category);

  return (
    <div className="space-y-4">
      <CategoryFilter />
      <WorkoutTable records={filteredRecords} />
    </div>
  );
}

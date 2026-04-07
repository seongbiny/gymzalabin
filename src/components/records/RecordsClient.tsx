'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CategoryFilter } from './CategoryFilter';
import { WorkoutTable } from './WorkoutTable';
import { Pagination } from './Pagination';
import { WorkoutDetailModal } from './WorkoutDetailModal';
import { filterByCategory } from '@/lib/workout-utils';
import type { WorkoutRecord, WorkoutCategory } from '@/types/workout';

interface RecordsClientProps {
  records: WorkoutRecord[];
}

const PAGE_SIZE = 20;

export function RecordsClient({ records }: RecordsClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const pageParam = searchParams.get('page');

  const [selectedRecord, setSelectedRecord] = useState<WorkoutRecord | null>(null);

  // 카테고리 유효성 검증
  const validCategories: WorkoutCategory[] = ['웨이트', '러닝'];
  const category =
    categoryParam && validCategories.includes(categoryParam as WorkoutCategory)
      ? (categoryParam as WorkoutCategory)
      : '전체';

  // 페이지 유효성 검증 (카테고리 변경 시 자동으로 page 파라미터 없으면 1로)
  const filteredRecords = filterByCategory(records, category);
  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE);
  const currentPage = Math.min(Math.max(Number(pageParam) || 1, 1), totalPages || 1);
  const pagedRecords = filteredRecords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-4">
      <CategoryFilter />
      <WorkoutTable records={pagedRecords} onRowClick={setSelectedRecord} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
      <WorkoutDetailModal
        record={selectedRecord}
        allRecords={records}
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}

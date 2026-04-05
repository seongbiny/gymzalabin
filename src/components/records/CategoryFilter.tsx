'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { WorkoutCategory } from '@/types/workout';

type FilterValue = WorkoutCategory | '전체';

const FILTER_OPTIONS: { label: string; value: FilterValue }[] = [
  { label: '전체', value: '전체' },
  { label: '웨이트', value: '웨이트' },
  { label: '러닝', value: '러닝' },
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = (searchParams.get('category') as FilterValue) ?? '전체';

  const handleFilter = useCallback(
    (value: FilterValue) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === '전체') {
        params.delete('category');
      } else {
        params.set('category', value);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div role="group" aria-label="카테고리 필터" className="flex gap-2">
      {FILTER_OPTIONS.map(({ label, value }) => (
        <Button
          key={value}
          variant={currentCategory === value ? 'default' : 'outline'}
          size="sm"
          className="rounded-full"
          onClick={() => handleFilter(value)}
          aria-pressed={currentCategory === value}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

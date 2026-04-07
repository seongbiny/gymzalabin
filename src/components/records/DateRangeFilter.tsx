'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';

export function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [from, setFrom] = useState(searchParams.get('from') ?? '');
  const [to, setTo] = useState(searchParams.get('to') ?? '');

  const handleApply = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (from) {
      params.set('from', from);
    } else {
      params.delete('from');
    }
    if (to) {
      params.set('to', to);
    } else {
      params.delete('to');
    }
    // 날짜 변경 시 페이지 초기화
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  }, [from, to, router, searchParams]);

  const handleReset = useCallback(() => {
    setFrom('');
    setTo('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('from');
    params.delete('to');
    params.delete('page');
    const query = params.toString();
    router.push(query ? `?${query}` : '/', { scroll: false });
  }, [router, searchParams]);

  const hasFilter = searchParams.get('from') || searchParams.get('to');

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
        <label htmlFor="date-from" className="text-sm text-muted-foreground">
          시작
        </label>
        <input
          id="date-from"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="text-sm border rounded-md px-2 py-1 bg-background text-foreground border-border focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
      <div className="flex items-center gap-1">
        <label htmlFor="date-to" className="text-sm text-muted-foreground">
          종료
        </label>
        <input
          id="date-to"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="text-sm border rounded-md px-2 py-1 bg-background text-foreground border-border focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
      <Button size="sm" variant="default" onClick={handleApply}>
        적용
      </Button>
      {hasFilter && (
        <Button size="sm" variant="outline" onClick={handleReset}>
          초기화
        </Button>
      )}
    </div>
  );
}

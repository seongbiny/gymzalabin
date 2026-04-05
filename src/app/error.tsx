'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('대시보드 오류:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-1">데이터를 불러오지 못했습니다</h2>
        <p className="text-sm text-muted-foreground">
          Notion API 연결을 확인하거나 잠시 후 다시 시도해주세요.
        </p>
      </div>
      <Button onClick={reset} variant="outline">
        다시 시도
      </Button>
    </div>
  );
}

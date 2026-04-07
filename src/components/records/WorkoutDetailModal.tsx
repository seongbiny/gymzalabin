'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { WorkoutRecord } from '@/types/workout';

interface WorkoutDetailModalProps {
  record: WorkoutRecord | null;
  allRecords: WorkoutRecord[];
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

export function WorkoutDetailModal({
  record,
  allRecords,
  isOpen,
  onClose,
}: WorkoutDetailModalProps) {
  if (!record) return null;

  // 동일 종목의 전체 기록 (최신순)
  const sameNameRecords = allRecords
    .filter((r) => r.name === record.name)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {record.name}
            <Badge variant={record.category === '웨이트' ? 'default' : 'secondary'}>
              {record.category}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-2 max-h-96 overflow-y-auto">
          {sameNameRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground">기록이 없습니다.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-1 pr-3">날짜</th>
                  {record.category === '웨이트' ? (
                    <>
                      <th className="text-right py-1 pr-3">무게(kg)</th>
                      <th className="text-right py-1 pr-3">세트×반복</th>
                    </>
                  ) : (
                    <th className="text-right py-1 pr-3">거리(km)</th>
                  )}
                  <th className="text-left py-1">메모</th>
                </tr>
              </thead>
              <tbody>
                {sameNameRecords.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-1 pr-3">{formatDate(r.date)}</td>
                    {record.category === '웨이트' ? (
                      <>
                        <td className="text-right py-1 pr-3">
                          {r.weightKg ?? '-'}
                        </td>
                        <td className="text-right py-1 pr-3">
                          {r.sets !== null && r.reps !== null
                            ? `${r.sets}×${r.reps}`
                            : '-'}
                        </td>
                      </>
                    ) : (
                      <td className="text-right py-1 pr-3">
                        {r.weightKg ?? '-'}
                      </td>
                    )}
                    <td className="py-1 text-muted-foreground truncate max-w-[120px]">
                      {r.memo || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { WorkoutRecord } from '@/types/workout';

interface WorkoutTableProps {
  records: WorkoutRecord[];
  onRowClick?: (record: WorkoutRecord) => void;
}

// 날짜 포맷: YYYY-MM-DD → MM/DD
function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function WorkoutTable({ records, onRowClick }: WorkoutTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border text-sm text-muted-foreground">
        운동 기록이 없습니다
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">날짜</TableHead>
            <TableHead>종목</TableHead>
            <TableHead className="w-24">카테고리</TableHead>
            <TableHead className="w-24">루틴</TableHead>
            <TableHead className="w-28">무게/거리</TableHead>
            <TableHead className="w-28">세트×반복</TableHead>
            <TableHead>메모</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow
              key={record.id}
              onClick={() => onRowClick?.(record)}
              className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
            >
              <TableCell className="text-sm">{formatDate(record.date)}</TableCell>
              <TableCell className="font-medium">{record.name}</TableCell>
              <TableCell>
                <Badge
                  variant={record.category === '웨이트' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {record.category}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {record.routine}
              </TableCell>
              <TableCell className="text-sm">
                {record.weightKg !== null
                  ? `${record.weightKg} ${record.category === '러닝' ? 'km' : 'kg'}`
                  : '-'}
              </TableCell>
              <TableCell className="text-sm">
                {record.sets !== null && record.reps !== null
                  ? `${record.sets}×${record.reps}`
                  : '-'}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                {record.memo || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

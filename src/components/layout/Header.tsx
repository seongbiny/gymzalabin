import { Dumbbell } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3">
          <Dumbbell className="h-6 w-6 text-indigo-500" aria-hidden="true" />
          <h1 className="text-xl font-bold tracking-tight">gymzalabin</h1>
          <span className="text-sm text-muted-foreground hidden sm:block">
            운동 로그 대시보드
          </span>
        </div>
      </div>
    </header>
  );
}

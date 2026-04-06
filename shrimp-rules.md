# gymzalabin — AI Agent 개발 가이드

## 1. 프로젝트 개요

- **목적**: Notion API를 CMS로 활용한 웨이트 & 러닝 운동 로그 대시보드
- **기술 스택**: Next.js 16.2.2 · React 19.2.4 · TypeScript · Tailwind CSS v4 · shadcn/ui · Chart.js
- **필수 환경 변수** (`.env.local`): `NOTION_TOKEN`, `NOTION_DATABASE_ID`
- **⚠️ 경고**: Next.js 16은 파괴적 변경이 포함된 버전이다. API·컨벤션을 사용하기 전에 반드시 `node_modules/next/dist/docs/`를 확인한다.

---

## 2. 디렉터리 구조 및 핵심 파일

```
src/
├── app/
│   ├── page.tsx          # 서버 컴포넌트 — Notion fetch, ISR revalidate: 60
│   ├── layout.tsx        # 루트 레이아웃 (Noto Sans KR, Header)
│   ├── loading.tsx       # Suspense 폴백 스켈레톤
│   └── error.tsx         # 'use client' 에러 바운더리
├── components/
│   ├── ui/               # shadcn CLI로 생성된 기본 컴포넌트 (직접 수정 금지)
│   ├── dashboard/        # StatsSection, ChartsSection, RecordsSection (서버 컴포넌트)
│   ├── charts/           # WeeklyVolumeChart, RunningDistanceChart, chartConfig.ts ('use client' 필수)
│   ├── records/          # CategoryFilter, RecordsClient, WorkoutTable ('use client' 사용)
│   ├── stats/            # StatsCard, StatsCardSkeleton
│   └── layout/           # Header
├── lib/
│   ├── notion.ts         # Notion 클라이언트 싱글톤 + DB 조회 함수
│   ├── workout-utils.ts  # 통계 계산 순수 함수
│   └── utils.ts          # Tailwind cn() 유틸
└── types/
    └── workout.ts        # 도메인 타입 정의 (단일 진실 공급원)
```

---

## 3. 타입 시스템 규칙

- `src/types/workout.ts`에 정의된 타입만 사용한다.
- 새 도메인 타입이 필요하면 반드시 `workout.ts`에 추가한다.
- **`any` 타입 사용 절대 금지**. Notion API 응답은 아래 타입가드 패턴으로 좁힌다.
- 핵심 타입 목록:

  | 타입 | 용도 |
  |------|------|
  | `WorkoutRecord` | Notion DB 단일 레코드 (파싱 후) |
  | `WorkoutCategory` | `'웨이트' \| '러닝'` |
  | `WorkoutRoutine` | `'가슴' \| '등' \| '하체' \| '어깨' \| '팔' \| '전신' \| '-'` |
  | `DashboardStats` | 대시보드 4대 통계 지표 |
  | `PRRecord` | 개인 최고 기록 (`name`, `value`, `unit`) |
  | `WeeklyVolumeData` | 주간 볼륨 차트 데이터 |
  | `RunningDistanceData` | 러닝 거리 차트 데이터 |

---

## 4. Notion API 규칙

### 4-1. 필드명 (한국어 그대로 사용)

| 필드 | Notion 타입 | 접근 키 |
|------|------------|---------|
| 이름 | title | `props['이름']` |
| 날짜 | date | `props['날짜']` |
| 카테고리 | select | `props['카테고리']` |
| 루틴 | select | `props['루틴']` |
| 무게(kg) | number | `props['무게(kg)']` |
| 세트 | number | `props['세트']` |
| 반복 | number | `props['반복']` |
| 메모 | rich_text | `props['메모']` |

### 4-2. 파싱 패턴 (lib/notion.ts)

- 모든 Notion 응답 페이지는 `isFullPage()` 필터링 후 처리한다.
- 속성별 타입가드 함수(`getTitleContent`, `getDateContent`, `getSelectContent`, `getNumberContent`, `getRichTextContent`)를 사용한다. 직접 캐스팅 금지.
- 새 속성을 추가할 때는 `lib/notion.ts`에 타입가드 함수를 먼저 추가한 뒤 `parseWorkoutRecord`를 수정한다.

### 4-3. ISR 설정

- `src/app/page.tsx`에 `export const revalidate = 60`이 반드시 있어야 한다.
- Notion API를 직접 호출하는 곳은 `lib/notion.ts`뿐이어야 한다. 컴포넌트에서 직접 호출 금지.

---

## 5. 컴포넌트 아키텍처 규칙

### 5-1. 서버 컴포넌트 (기본값)

- `src/app/page.tsx`: Notion fetch → 데이터를 Section 컴포넌트로 props 전달
- `src/components/dashboard/*Section.tsx`: props를 받아 하위 컴포넌트에 전달
- `src/components/stats/*`, `src/components/layout/*`: props만 받는 순수 UI

### 5-2. 클라이언트 컴포넌트 (`'use client'` 필수)

- `src/components/charts/*.tsx`: react-chartjs-2는 브라우저 전용
- `src/components/records/RecordsClient.tsx`: `useSearchParams()` 사용
- `src/components/records/CategoryFilter.tsx`: URL 파라미터 조작
- `src/app/error.tsx`: Next.js 에러 바운더리

### 5-3. 클라이언트/서버 경계 원칙

- 데이터 페칭은 항상 서버 컴포넌트에서 한다.
- 클라이언트 컴포넌트는 이미 가공된 데이터(`WorkoutRecord[]`, 통계 객체)를 props로 받는다.
- `useSearchParams()`는 반드시 `<Suspense>`로 감싼 컴포넌트 안에서 사용한다.

---

## 6. 통계 함수 규칙 (lib/workout-utils.ts)

- 모든 통계·집계·필터 로직은 `src/lib/workout-utils.ts`에만 작성한다.
- 함수는 순수 함수여야 한다 (부작용 없음, 동일 입력 → 동일 출력).
- 기존 함수 목록:

  | 함수 | 역할 |
  |------|------|
  | `calcWeeklyVolume(records)` | 이번 주 웨이트 볼륨 (무게 × 세트 × 반복) |
  | `calcPersonalRecord(records)` | 종목별 최고 기록 |
  | `calcCumulativeDistance(records)` | 러닝 누적 거리 |
  | `calcWorkoutDays(records)` | 운동 일수 |
  | `calcDashboardStats(records)` | 위 4개를 한번에 계산 |
  | `groupByWeek(records)` | 최근 8주 주간 볼륨 그룹핑 |
  | `groupRunningByDate(records)` | 최근 30일 러닝 거리 그룹핑 |
  | `filterByCategory(records, category)` | 카테고리 필터링 |

- 새 통계 지표 추가 시: `workout-utils.ts`에 함수 추가 → `workout.ts`에 타입 추가 → `page.tsx`에서 호출.

---

## 7. 스타일링 규칙

### 7-1. Tailwind CSS v4

- `globals.css`는 `@import "tailwindcss"` 방식이다. `@tailwind base/components/utilities` 지시어 사용 금지.
- CSS 변수 색상 토큰(`--color-background`, `--color-primary` 등)은 `globals.css`의 `@theme inline` 블록에 정의되어 있다.
- 의미론적 색상 클래스 사용: `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border` 등.

### 7-2. shadcn/ui 컴포넌트

- `src/components/ui/` 파일은 `npx shadcn add <component>` 명령으로만 추가한다.
- `components/ui/` 파일을 직접 편집하지 않는다 (CLI 재생성 시 덮어써짐).
- 현재 설치된 컴포넌트: `badge`, `button`, `card`, `select`, `skeleton`, `table`.

### 7-3. 차트 테마

- 차트 색상은 `src/components/charts/chartConfig.ts`의 `CHART_COLORS` 상수를 사용한다.
- 웨이트 차트: `CHART_COLORS.weight.*` (indigo 계열)
- 러닝 차트: `CHART_COLORS.running.*` (emerald 계열)
- 새 차트 추가 시 `chartConfig.ts`에 색상 상수를 먼저 정의한다.

---

## 8. 데이터 흐름

```
Notion DB
  └─► lib/notion.ts (fetchWorkoutRecords / fetchWorkoutRecordsByDateRange)
        └─► app/page.tsx [서버 컴포넌트, ISR 60s]
              ├─► lib/workout-utils.ts (calcDashboardStats, groupByWeek, groupRunningByDate)
              ├─► components/dashboard/StatsSection.tsx
              │     └─► components/stats/StatsCard.tsx
              ├─► components/dashboard/ChartsSection.tsx
              │     ├─► components/charts/WeeklyVolumeChart.tsx ['use client']
              │     └─► components/charts/RunningDistanceChart.tsx ['use client']
              └─► components/dashboard/RecordsSection.tsx
                    └─► components/records/RecordsClient.tsx ['use client']
                          ├─► components/records/CategoryFilter.tsx (URL ?category=)
                          └─► components/records/WorkoutTable.tsx
```

---

## 9. 파일 수정 연동 규칙

| 이 파일을 수정하면 | 반드시 함께 확인/수정 |
|-------------------|----------------------|
| `src/types/workout.ts` | `src/lib/notion.ts` (파싱 함수), `src/lib/workout-utils.ts` (통계 함수) |
| `src/lib/notion.ts` (필드 추가) | `src/types/workout.ts` (타입 추가), `parseWorkoutRecord` 함수 |
| `src/lib/workout-utils.ts` (새 함수) | `src/app/page.tsx` (호출 추가), `src/types/workout.ts` (반환 타입) |
| `src/components/charts/chartConfig.ts` | 해당 차트 컴포넌트 |
| Notion DB 스키마 변경 | `src/lib/notion.ts` 타입가드 함수 + `src/types/workout.ts` |

---

## 10. 카테고리 필터 규칙

- 필터 상태는 URL 쿼리 파라미터 `?category=웨이트|러닝`으로 관리한다.
- `RecordsClient.tsx`에서 `useSearchParams()`로 읽는다.
- 유효하지 않은 값은 `'전체'`로 처리한다.
- `filterByCategory()` 함수를 사용하며, 직접 `Array.filter` 로직 작성 금지.

---

## 11. 금지 사항

- **`any` 타입 사용 금지** — Notion API 응답을 포함한 모든 곳
- **`components/ui/` 직접 편집 금지** — shadcn CLI로만 관리
- **컴포넌트에서 직접 Notion API 호출 금지** — `lib/notion.ts`를 통해서만
- **`page.tsx`의 `revalidate = 60` 제거 금지** — Notion API 요청 제한(초당 3회) 대응
- **차트 컴포넌트에 `'use client'` 누락 금지** — 빌드 오류 발생
- **`useSearchParams()` Suspense 없이 사용 금지** — Next.js 16 요구사항
- **한국어 Notion 필드명을 영어로 바꾸지 말 것** — 실제 DB 스키마와 일치해야 함
- **`globals.css`에 `@tailwind` 지시어 추가 금지** — Tailwind v4와 비호환
- **Next.js API 변경 없이 이전 버전 패턴 사용 금지** — `node_modules/next/dist/docs/` 확인 필수

# ROADMAP: gymzalabin

> Notion CMS 기반 운동 로그 대시보드 개발 로드맵

---

## 개발 원칙

- **의존성 우선**: 하위 레이어가 준비된 후 상위 레이어를 개발한다
- **타입 먼저**: 데이터 타입을 먼저 정의하고 UI를 작성한다
- **공통 → 특수**: 공통 모듈/컴포넌트를 먼저 만들고 기능별 컴포넌트를 조립한다

---

## Phase 1 — 프로젝트 초기 설정 (골격 구축)

> **이유**: 환경 설정 없이는 어떤 코드도 실행할 수 없다. 전체 팀이 동일한 환경에서 출발해야 하며, 이후 모든 단계의 전제 조건이 된다.

### 작업 목록

- [ ] `@notionhq/client` 패키지 설치
- [ ] `chart.js`, `react-chartjs-2` 패키지 설치
- [ ] `lucide-react` 패키지 설치 (이미 설치된 경우 확인)
- [ ] Notion Integration 생성 및 API 키 발급
- [ ] `.env.local`에 `NOTION_TOKEN`, `NOTION_DATABASE_ID` 환경 변수 설정
- [ ] Notion DB 생성 (PRD §4 스키마 적용)
- [ ] Notion DB에 Integration 공유(Share) 권한 부여
- [ ] 폴더 구조 확정 및 초기화

```CLAUDE.md 파일을 열어서 다음 내용이 있는지 확인하고, 없으면 추가해줘:

# Project Context
- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md

이렇게 @경로 형식으로 추가해서 Claude Code가 이 파일들을 참고할 수 있도록 해줘.
src/
├── app/
│   └── page.tsx          # 대시보드 메인
├── components/
│   ├── ui/               # shadcn/ui 기본 컴포넌트
│   ├── stats/            # 통계 카드
│   ├── charts/           # 차트 컴포넌트
│   └── table/            # 기록 테이블
├── lib/
│   └── notion.ts         # Notion 클라이언트 유틸
└── types/
    └── workout.ts        # 데이터 타입 정의
```

### 완료 기준

- `npm run dev` 실행 시 오류 없이 로컬 서버가 기동된다
- `.env.local` 환경 변수가 설정되어 있다
- Notion DB가 생성되고 Integration과 연결되어 있다

### 예상 소요 시간

**0.5일**

---

## Phase 2 — 공통 모듈 / 타입 정의

> **이유**: 타입과 데이터 유틸이 없으면 UI 컴포넌트를 작성할 수 없다. 이 단계에서 Notion API 응답을 애플리케이션 도메인 타입으로 변환하는 레이어를 확립해야 이후 단계에서 `any` 타입 없이 안전하게 개발할 수 있다.

### 작업 목록

- [ ] `types/workout.ts` — 도메인 타입 정의

  ```ts
  // 예시
  type WorkoutCategory = '웨이트' | '러닝';
  type WorkoutRoutine = '가슴' | '등' | '하체' | '어깨' | '팔' | '전신' | '-';

  interface WorkoutLog {
    id: string;
    name: string;
    date: string;
    category: WorkoutCategory;
    routine: WorkoutRoutine;
    weight: number;
    sets: number;
    reps: number;
    memo: string;
  }
  ```

- [ ] `lib/notion.ts` — Notion 클라이언트 초기화 및 DB 조회 함수
  - Notion API 클라이언트 싱글톤 생성
  - `getWorkoutLogs(dateRange?)` 함수 구현 (날짜 범위 필터 포함)
  - Notion 응답 → `WorkoutLog[]` 매핑 함수 구현
- [ ] `lib/stats.ts` — 통계 계산 순수 함수
  - `calcWeeklyVolume(logs)` — 주간 볼륨 (무게 × 세트 합산)
  - `calcPersonalRecords(logs)` — 종목별 최고 기록 (PR)
  - `calcTotalDistance(logs)` — 러닝 누적 거리
  - `calcWorkoutDays(logs)` — 운동 일수

### 완료 기준

- Notion API 호출이 성공하고 `WorkoutLog[]` 타입으로 반환된다
- `any` 타입이 사용되지 않는다
- 통계 계산 함수가 올바른 값을 반환한다

### 예상 소요 시간

**1일**

---

## Phase 3 — 핵심 기능 개발

> **이유**: 공통 모듈이 준비된 후 핵심 기능(통계 카드, 차트, 테이블)을 개발한다. 이 세 가지가 PRD에서 정의한 메인 페이지의 전체 구조를 이룬다. 각 컴포넌트는 독립적으로 개발하고 마지막에 페이지에서 조립한다.

### 3-1. 통계 카드

- [ ] `components/stats/StatCard.tsx` — 개별 지표 카드 (레이블 + 값 + 아이콘)
- [ ] `components/stats/StatsGrid.tsx` — 4개 카드 그리드 레이아웃
  - 주간 볼륨, 최고 기록(PR), 누적 거리, 운동 일수

### 3-2. 차트

- [ ] `components/charts/WeeklyVolumeChart.tsx` — 주간 볼륨 바 차트
- [ ] `components/charts/RunningDistanceChart.tsx` — 러닝 누적 거리 라인 차트
- [ ] 차트 공통 테마 설정 (색상, 폰트, 툴팁)

### 3-3. 운동 기록 테이블

- [ ] `components/table/WorkoutTable.tsx` — shadcn/ui `Table` 기반 기록 목록
  - 컬럼: 날짜 / 종목 / 카테고리 / 루틴 / 무게(kg) / 세트 / 반복 / 메모
  - 최신순 정렬
- [ ] `components/table/CategoryFilter.tsx` — 웨이트 / 러닝 / 전체 필터 탭

### 3-4. 메인 페이지 조립

- [ ] `app/page.tsx` — Notion API 호출 (서버 컴포넌트) 후 각 컴포넌트에 데이터 전달
- [ ] ISR `revalidate: 60` 설정

### 완료 기준

- 메인 페이지에서 통계 카드, 차트, 테이블이 모두 렌더링된다
- Notion DB 데이터가 실제로 반영된다
- 카테고리 필터가 동작한다

### 예상 소요 시간

**2일**

---

## Phase 4 — 추가 기능 개발

> **이유**: 핵심 기능이 완성된 후 UX를 개선하는 부가 기능을 추가한다. 선택적 기능이므로 핵심 기능에 영향을 주지 않는 시점에 진행한다.

### 작업 목록

- [ ] 페이지네이션 또는 무한 스크롤 구현 (기록 테이블)
- [ ] 날짜 범위 필터 UI (기간 선택)
- [ ] 종목별 PR 상세 뷰 (모달 또는 드로어)
- [ ] 운동 없는 날 공백 처리 (차트 날짜 연속성 보장)

### 완료 기준

- 페이지네이션(또는 무한 스크롤)이 정상 동작한다
- 날짜 범위 변경 시 차트와 통계가 갱신된다

### 예상 소요 시간

**1일**

---

## Phase 5 — 최적화 및 배포

> **이유**: 기능이 완성된 후 성능·접근성·안정성을 점검하고 배포 환경을 구성한다. 최적화는 기능이 확정된 이후에 진행해야 불필요한 재작업을 방지할 수 있다.

### 작업 목록

- [ ] 반응형 레이아웃 점검 — 모바일(375px) ~ 데스크탑(1440px)
- [ ] 로딩 스켈레톤 UI — `loading.tsx` 또는 Suspense 경계 설정
- [ ] 에러 바운더리 처리 — `error.tsx`, Notion API 실패 시 Fallback UI
- [ ] 차트 접근성 — `aria-label` 속성 추가, WCAG AA 색상 대비 확인
- [ ] Vercel 배포 설정
  - 환경 변수(`NOTION_TOKEN`, `NOTION_DATABASE_ID`) Vercel 대시보드에 등록
  - Preview / Production 브랜치 전략 확정
- [ ] Notion API 요청 제한 대응 확인 (초당 3회 제한 → ISR 캐싱으로 충분한지 검증)

### 완료 기준

- Lighthouse 성능 점수 80점 이상
- 모바일/데스크탑 레이아웃 깨짐 없음
- Vercel Production 배포 성공
- Notion API 호출이 ISR 캐시를 통해 최소화된다

### 예상 소요 시간

**1일**

---

## 전체 일정 요약

| Phase | 내용 | 예상 기간 |
|-------|------|-----------|
| 1 | 프로젝트 초기 설정 | 0.5일 |
| 2 | 공통 모듈 / 타입 정의 | 1일 |
| 3 | 핵심 기능 개발 | 2일 |
| 4 | 추가 기능 개발 | 1일 |
| 5 | 최적화 및 배포 | 1일 |
| **합계** | | **5.5일** |

---

## 의존성 그래프

```
Phase 1 (환경 설정)
  └─► Phase 2 (공통 모듈 / 타입)
        └─► Phase 3 (핵심 기능)
              ├─► Phase 4 (추가 기능)
              └─► Phase 5 (최적화 / 배포)
```

> Phase 4와 Phase 5는 Phase 3 완료 후 병렬 진행 가능하다.

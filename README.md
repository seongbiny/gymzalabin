# gymzalabin

> Notion을 CMS로 활용한 운동 로그 대시보드

## 소개

Notion에 웨이트 / 러닝 기록을 입력하면 웹 대시보드에서 차트와 통계로 시각화해주는 프로젝트입니다.  
별도 관리자 페이지 없이 Notion에서 직접 데이터를 관리할 수 있어 비개발자도 쉽게 사용할 수 있습니다.

## 주요 기능

- **운동 기록 시각화**: 주간 볼륨 바 차트, 러닝 거리 라인 차트
- **통계 대시보드**: 주간 볼륨 / 최고 기록(PR) / 누적 거리 / 운동 일수
- **기록 테이블**: 전체 운동 기록 목록 (카테고리 필터 지원)

## 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | Next.js 15, TypeScript |
| CMS | Notion API |
| Styling | Tailwind CSS, shadcn/ui |
| 차트 | Chart.js |
| 아이콘 | Lucide React |

## Notion DB 스키마

| 필드 | 타입 | 예시 |
|------|------|------|
| 이름 | Title | 벤치프레스, 5km 러닝 |
| 날짜 | Date | 2026-04-02 |
| 카테고리 | Select | 웨이트 / 러닝 |
| 루틴 | Select | 가슴 / 등 / 하체 / 어깨 / 팔 / 전신 / - |
| 무게(kg) | Number | 60, 5.0 |
| 세트 | Number | 3 |
| 반복 | Number | 10 |
| 메모 | Text | 그립 넓게, 페이스 6:00 |

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```env
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_database_id
```

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 문서

- [PRD (제품 요구사항 명세서)](./docs/PRD.md)

## 라이선스

MIT

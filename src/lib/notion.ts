import { Client, isFullPage } from '@notionhq/client';
import type {
  PageObjectResponse,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints';
import type { WorkoutRecord, WorkoutCategory, WorkoutRoutine } from '@/types/workout';

// Notion 클라이언트 초기화 (싱글톤)
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? '';

// --- 내부 타입 가드 함수 ---

function getTitleContent(
  prop: PageObjectResponse['properties'][string] | undefined
): string {
  if (!prop || prop.type !== 'title') return '';
  return prop.title.map((t) => t.plain_text).join('');
}

function getDateContent(
  prop: PageObjectResponse['properties'][string] | undefined
): string {
  if (!prop || prop.type !== 'date' || !prop.date) return '';
  return prop.date.start;
}

function getSelectContent(
  prop: PageObjectResponse['properties'][string] | undefined
): string {
  if (!prop || prop.type !== 'select' || !prop.select) return '';
  return prop.select.name;
}

function getNumberContent(
  prop: PageObjectResponse['properties'][string] | undefined
): number | null {
  if (!prop || prop.type !== 'number') return null;
  return prop.number;
}

function getRichTextContent(
  prop: PageObjectResponse['properties'][string] | undefined
): string {
  if (!prop || prop.type !== 'rich_text') return '';
  return prop.rich_text.map((t) => t.plain_text).join('');
}

// --- 파싱 함수 ---

function parseWorkoutRecord(page: PageObjectResponse): WorkoutRecord {
  const props = page.properties;

  const rawCategory = getSelectContent(props['카테고리']);
  const category: WorkoutCategory =
    rawCategory === '웨이트' || rawCategory === '러닝'
      ? rawCategory
      : '웨이트';

  const rawRoutine = getSelectContent(props['루틴']);
  const validRoutines: WorkoutRoutine[] = ['가슴', '등', '하체', '어깨', '팔', '전신', '-'];
  const routine: WorkoutRoutine = validRoutines.includes(rawRoutine as WorkoutRoutine)
    ? (rawRoutine as WorkoutRoutine)
    : '-';

  return {
    id: page.id,
    name: getTitleContent(props['이름']),
    date: getDateContent(props['날짜']),
    category,
    routine,
    weightKg: getNumberContent(props['무게(kg)']),
    sets: getNumberContent(props['세트']),
    reps: getNumberContent(props['반복']),
    memo: getRichTextContent(props['메모']),
  };
}

// --- 공개 API ---

/**
 * 전체 운동 기록 조회 (날짜 내림차순)
 */
export async function fetchWorkoutRecords(): Promise<WorkoutRecord[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [{ property: '날짜', direction: 'descending' }],
    });

    return response.results
      .filter(isFullPage)
      .map(parseWorkoutRecord);
  } catch (error) {
    console.error('Notion API 조회 실패:', error);
    return [];
  }
}

/**
 * 날짜 범위로 운동 기록 조회
 */
export async function fetchWorkoutRecordsByDateRange(
  startDate: string,
  endDate: string
): Promise<WorkoutRecord[]> {
  try {
    const filter: QueryDatabaseParameters['filter'] = {
      and: [
        {
          property: '날짜',
          date: { on_or_after: startDate },
        },
        {
          property: '날짜',
          date: { on_or_before: endDate },
        },
      ],
    };

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter,
      sorts: [{ property: '날짜', direction: 'descending' }],
    });

    return response.results
      .filter(isFullPage)
      .map(parseWorkoutRecord);
  } catch (error) {
    console.error('Notion API 날짜 범위 조회 실패:', error);
    return [];
  }
}

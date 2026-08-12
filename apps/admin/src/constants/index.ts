import type { TCourseStatus } from "@repo/types"

export const COURSES_APP_LOGIN = 'COURSES_APP_LOGIN'
export const COURSES_APP_ROLE = 'COURSES_APP_ROLE'
export const COURSES_APP_TOKEN = 'COURSES_APP_TOKEN'

export const statusColorsForCoursesTable: Record<TCourseStatus, string> = {
  'draft': 'geekblue',
  'published': '#63a349',
  'archive': '#ccc'
}

export const coursesTableColumnConfig = [
  {
    title: 'Название',
    dataIndex: 'title',
    key: 'title',
    width: '50%'
  },
  {
    title: 'Автор',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: 'Статус',
    key: 'status',
    dataIndex: 'status',
  },
  {
    title: 'Создан',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '',
    key: 'controls',
  }
];
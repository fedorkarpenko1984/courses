export type TAdminRole = 'admin' | 'superadmin'

export interface IAdmin {
  id?: number
  login: string
  password?: string
  role: TAdminRole
  createdAt?: Date
  updatedAt?: Date
}

export type TCourseStatus = 'draft' | 'published' | 'archive'

export interface ICourse {
  id: number
  title: string
  description: string
  chapters: number[]
  author: string
  previewImage?: string | null
  status: TCourseStatus
  createdAt?: Date
  updatedAt?: Date
}

interface ICourseChildBasic {
  id: number
  courseId: number
  title: string
  isPublished: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IChapter extends ICourseChildBasic{
  children: string[]
}

export interface ISubchapter extends ICourseChildBasic{
  lessons: number[]
  chapterId: number
}

export interface ILesson extends ICourseChildBasic {
  chapterId: number
  subchapterId?: number
  data: string
}
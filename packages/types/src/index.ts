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

interface IChapterBasic {
  id: number
  courseId: number
  title: string
  isPublished: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IChapter extends IChapterBasic{
  children: string[]
}

export interface IChapterStructure extends IChapterBasic{
  children: ISubchapter[]
}

export interface ISubchapter extends IChapterBasic{
  lessons: number[]
}
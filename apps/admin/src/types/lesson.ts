export type TLessonBlockType = 'text' | 'video'

interface ILessonBlockBase {
  id: string
  type: TLessonBlockType
}

export interface ILessonBlockText extends ILessonBlockBase {
  type: 'text',
  content: string
}

export interface ILessonBlockVideo extends ILessonBlockBase {
  type: 'video',
  content: string | File
}

export type TLessonBlockCommon = ILessonBlockText | ILessonBlockVideo
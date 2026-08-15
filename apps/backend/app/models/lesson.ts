import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Course from '#models/course'
import Chapter from '#models/chapter'
import Subchapter from '#models/subchapter'

export default class Lesson extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare courseId: number

  @column()
  declare chapterId: number

  @column()
  declare subchapterId: number | null

  @column()
  declare title: string

  @column({
    prepare: (value: any) => {
      if (value === null || value === undefined) {
        return null
      }
      if (typeof value === 'string') {
        try {
          JSON.parse(value)
          return value
        } catch {
          return JSON.stringify(value)
        }
      }
      return JSON.stringify(value)
    },
    consume: (value: any) => {
      if (!value) return null
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      }
      return value
    }
  })
  declare data: any

  @column()
  declare isPublished: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Связь с курсом
  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>

  // Связь с главой
  @belongsTo(() => Chapter)
  declare chapter: BelongsTo<typeof Chapter>

  // Связь с подразделом (опционально)
  @belongsTo(() => Subchapter)
  declare subchapter: BelongsTo<typeof Subchapter>
}
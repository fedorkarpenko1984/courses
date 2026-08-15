// app/models/subchapter.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Course from '#models/course'
import Chapter from '#models/chapter'

export default class Subchapter extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare courseId: number

  @column()
  declare chapterId: number

  @column()
  declare title: string

  @column({
    prepare: (value: any) => {
      if (!value) return '[]'
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
      if (!value) return []
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      }
      return value
    }
  })
  declare lessons: number[]

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
}
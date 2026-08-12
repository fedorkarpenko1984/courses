import { BaseModel, column, beforeSave  } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { type TCourseStatus } from '@repo/types'
 
export default class Course extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare chapters: number[]

  @column()
  declare author: string

  @column()
  declare previewImage: string | null

  @column()
  declare status: TCourseStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async stringifyChapters(course: Course) {
    if (course.$dirty.chapters) {
      const chapters = course.$getAttribute('chapters')
      if (Array.isArray(chapters)) {
        course.$setAttribute('chapters', JSON.stringify(chapters))
      }
    }
  }
}
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subchapters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      table.integer('course_id').unsigned().notNullable()
      table.foreign('course_id')
        .references('courses.id')
        .onDelete('CASCADE')
      
      table.integer('chapter_id').unsigned().notNullable()
      table.foreign('chapter_id')
        .references('chapters.id')
        .onDelete('CASCADE')
      
      table.string('title').notNullable()
      table.json('lessons').nullable().defaultTo('[]')
      table.boolean('is_published').defaultTo(false)
      table.timestamps(true, true)
      
      table.index('course_id')
      table.index('chapter_id')
      table.index('is_published')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
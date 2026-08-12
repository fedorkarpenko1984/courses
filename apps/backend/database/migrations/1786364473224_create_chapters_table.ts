import { BaseSchema } from "@adonisjs/lucid/schema"

export default class extends BaseSchema {
  protected tableName = 'chapters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      table.integer('course_id').unsigned().notNullable()
      table.foreign('course_id').references('courses.id').onDelete('CASCADE')
      table.string('title').notNullable()
      table.json('subchapters').nullable().defaultTo('[]')
      table.json('lessons').nullable().defaultTo('[]')
      table.boolean('is_published').defaultTo(false)
      table.timestamps(true, true)
      
      table.index('course_id')
      table.index('is_published')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
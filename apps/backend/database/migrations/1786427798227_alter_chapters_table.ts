import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'chapters'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('subchapters')
      table.dropColumn('lessons')
      table.json('children').nullable().defaultTo('[]')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('children')
      table.json('subchapters').nullable().defaultTo('[]')
      table.json('lessons').nullable().defaultTo('[]')
    })
  }
}
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.renameTable('contests', 'courses')
  }

  async down() {
    this.schema.renameTable('courses', 'contests')
  }
}
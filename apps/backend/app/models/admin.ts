import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export type AdminRole = 'admin' | 'superadmin'

export default class Admin extends BaseModel {
  static tokenableType = 'admin'  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare login: string

  @column()
  declare password: string

  @column()
  declare role: AdminRole

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Хук для хеширования пароля
  @beforeSave()
  static async hashPassword(admin: Admin) {
    if (admin.$dirty.password) {
      admin.password = await hash.make(admin.password)
    }
  }

  // Метод для проверки пароля
  async verifyPassword(plainPassword: string): Promise<boolean> {
    return hash.verify(this.password, plainPassword)
  }

  // Провайдер токенов
  static accessTokens = DbAccessTokensProvider.forModel(Admin, {
    expiresIn: '2 hours',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
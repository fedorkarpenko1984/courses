import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Admin from '#models/admin'

export default class AdminSeeder extends BaseSeeder {
  async run() {
        console.log('🟢 Сид запущен!') // <-- Добавьте для проверки

    const admin = await Admin.firstOrCreate(
      { login: 'admin' },
      {
        login: 'admin',
        password: 'password',
        role: 'superadmin'
      }
    )
    console.log('✅ Администратор создан:', admin.login) // <-- Добавьте для пров
  }
}
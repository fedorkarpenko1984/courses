// app/controllers/auth/admin_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Admin from '#models/admin'
import { adminLoginValidator } from '#validators/admin'

export default class AdminsController {
  /**
   * Авторизация администратора
   * POST /admin/login
   */
  async login({ request, response }: HttpContext) {
    try {
      // 1. Валидируем данные
      const { login, password } = await request.validateUsing(adminLoginValidator)

      // 2. Ищем администратора по логину
      const admin = await Admin.findBy('login', login)

      if (!admin) {
        return response.unauthorized({
          message: 'Неверный логин или пароль'
        })
      }

      // 3. Проверяем пароль
      const isValid = await admin.verifyPassword(password)

      if (!isValid) {
        return response.unauthorized({
          message: 'Неверный логин или пароль'
        })
      }

      // 4. Создаём токен доступа
      const token = await Admin.accessTokens.create(admin, ['*'])

      // 5. Возвращаем ответ
      return response.ok({
        token: token.value!.release(),
        login: admin.login,
        role: admin.role,
        id: admin.id
      })
    } catch (error) {
      // Обработка ошибок валидации

      return response.internalServerError({
        message: 'Ошибка при авторизации'
      })
    }
  }

  /**
   * Получение информации о текущем администраторе
   * GET /admin/me
   */
}
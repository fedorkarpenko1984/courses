// app/controllers/auth/access_tokens_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Admin from '#models/admin'
import { adminLoginValidator } from '#validators/admin'

export default class AccessTokensController {

  async store({ request, response }: HttpContext) {
    try {
      const { login, password } = await request.validateUsing(adminLoginValidator)

      const admin = await Admin.findBy('login', login)

      if (!admin) {
        return response.unauthorized({
          message: 'Неверный логин или пароль'
        })
      }

      const isValid = await admin.verifyPassword(password)

      if (!isValid) {
        return response.unauthorized({
          message: 'Неверный логин или пароль'
        })
      }

      const token = await Admin.accessTokens.create(admin, ['*'])
    
      return response.ok({
        token: token.value!.release(),
        login: admin.login,
        role: admin.role,
        id: admin.id
      })
    } catch (error) {

      return response.internalServerError({
        message: 'Ошибка при авторизации'
      })
    }
  }

  async me({ auth, response }: HttpContext) {
    try {
      // Получаем текущего администратора
      const admin = auth.getUserOrFail()

      return response.ok({
        id: admin.id,
        login: admin.login,
        role: admin.role,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      })
    } catch (error) {
      return response.unauthorized({
        message: 'Токен невалидный или истёк'
      })
    }
  }

  async destroy({ auth, response }: HttpContext) {
    try {
      const admin = auth.getUserOrFail()

      if (admin.currentAccessToken) {
        await Admin.accessTokens.delete(admin, admin.currentAccessToken.identifier)
      }

      return response.ok({
        message: 'Выход выполнен успешно'
      })
    } catch (error) {
      return response.unauthorized({
        message: 'Токен невалидный или истёк'
      })
    }
  }
}
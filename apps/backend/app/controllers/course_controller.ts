// app/controllers/admin/courses_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import { createCourseValidator, updateCourseValidator } from '#validators/course'
import Chapter from '#models/chapter'

export default class CoursesController {

  async getAll({ response }: HttpContext) {
    const courses = await Course.all()
    return response.ok(courses)
  }

  async getCourse({ params, response }: HttpContext) {
    try {
      const course = await Course.findOrFail(params.id)
      const query = Chapter.query()
          
      query.where('courseId', course.id)
      const chapters = await query

      return response.ok({
        course,
        chapters
      })
    } catch (error) {
      return response.notFound({
        message: 'Курс не найден'
      })
    }
  }

  async create({ request, response }: HttpContext) {

    try {
      const data = await request.validateUsing(createCourseValidator)
      
      const course = await Course.create({
        ...data,
        chapters: data.chapters || [],
        previewImage: data.previewImage || null,
        status: data.status || 'draft'
      })
      console.log('course', course)
      
      return response.created(course)
    } catch (error: any) {
      console.log('error', error)
      if (error.messages) {
        return response.badRequest({
          errors: error.messages
        })
      }
      return response.internalServerError({
        message: 'Ошибка при создании курса'
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const course = await Course.findOrFail(params.id)
      
      const data = await request.validateUsing(updateCourseValidator)
      
      console.log('data', data);
      course.merge({
        ...data,
        previewImage: data.previewImage ?? course.previewImage,
      })
      console.log('course', course)
      await course.save()
      
      return response.ok(course)
    } catch (error:any) {
      console.log('error', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Курс не найден'
        })
      }
      if (error.messages) {
        return response.badRequest({
          errors: error.messages
        })
      }
      return response.internalServerError({
        message: 'Ошибка при обновлении курса'
      })
    }
  }

  async destroy({ params, response, auth }: HttpContext) {
    try {
      const admin = auth.getUserOrFail()
      const course = await Course.findOrFail(params.id)
      
      if (course.author !== admin.login) {
        return response.forbidden({
          message: 'Вы не можете удалить этот курс'
        })
      }
      
      await course.delete()
      
      return response.ok({
        message: 'Курс успешно удалён'
      })
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Курс не найден'
        })
      }
      return response.internalServerError({
        message: 'Ошибка при удалении курса'
      })
    }
  }
}
// app/controllers/admin/courses_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import { createCourseValidator, updateCourseValidator } from '#validators/course'
import Chapter from '#models/chapter'
import Subchapter from '#models/subchapter'
import Lesson from '#models/lesson'

export default class CoursesController {

  async getAll({ response }: HttpContext) {
    const courses = await Course.all()
    return response.ok(courses)
  }

  async getCourse({ params, response }: HttpContext) {
    try {
      const course = await Course.findOrFail(params.id)

      const queryChapters = Chapter.query()          
      queryChapters.where('courseId', course.id)
      const chapters = await queryChapters

      const querySubchapters = Subchapter.query()
      querySubchapters.where('courseId', course.id)
      const subchapters = await querySubchapters

      const queryLessons = Lesson.query()
      queryLessons.where('courseId', course.id)
      const lessons = await queryLessons
      const lessonsWithoutData = lessons.map(lesson => {
        const lessonObject = lesson.toJSON()
        return {
          ...lessonObject,
          data: ''
        }
      })

      return response.ok({
        course,
        chapters,
        subchapters,
        lessons: lessonsWithoutData
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
      
      course.merge({
        ...data,
        previewImage: data.previewImage ?? course.previewImage,
      })
      await course.save()
      
      return response.ok(course)
    } catch (error:any) {
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
      const course = await Course.findOrFail(params.id)

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
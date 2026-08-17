// app/controllers/lessons_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Lesson from '#models/lesson'
import Course from '#models/course'
import Chapter from '#models/chapter'
import Subchapter from '#models/subchapter'
import { createLessonValidator, updateLessonValidator } from '#validators/lesson'

export default class LessonsController {
  async show({ params, response }: HttpContext) {
    try {
      const lesson = await Lesson.find(params.id)
      
      if (!lesson) {
        return response.notFound({
          message: 'Урок не найден'
        })
      }
      
      return response.ok(lesson)
    } catch (error) {
      console.error('Ошибка при получении урока:', error)
      return response.internalServerError({
        message: 'Ошибка при получении урока'
      })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createLessonValidator)
      console.log('data', data)
      
      // Проверяем существование курса
      const course = await Course.find(data.courseId)
      if (!course) {
        return response.notFound({
          message: 'Курс не найден'
        })
      }
      
      // Проверяем существование главы
      const chapter = await Chapter.find(data.chapterId)
      if (!chapter) {
        return response.notFound({
          message: 'Глава не найдена'
        })
      }
      
      // Если указан subchapterId - проверяем его существование
      if (data.subchapterId) {
        const subchapter = await Subchapter.find(data.subchapterId)
        if (!subchapter) {
          return response.notFound({
            message: 'Подраздел не найден'
          })
        }
      }
      
      const lesson = await Lesson.create({
        ...data,
        data: data.data || null,
      })

      let currentChapterChildrens: string[] = []
    
      if (chapter.children) {
        if (Array.isArray(chapter.children)) {
          currentChapterChildrens = chapter.children
        } else if (typeof chapter.children === 'string') {
          try {
            const parsed = JSON.parse(chapter.children)
            currentChapterChildrens = Array.isArray(parsed) ? parsed : []
          } catch {
            currentChapterChildrens = []
          }
        }
      }

      chapter.children = [...currentChapterChildrens, `les${lesson.id}`]
      await chapter.save()      

      return response.created(lesson)
    } catch (error: any) {
      console.error('Ошибка при создании урока:', error)
      
      if (error.messages) {
        return response.badRequest({
          errors: error.messages
        })
      }
      
      return response.internalServerError({
        message: 'Ошибка при создании урока'
      })
    }
  }

  /**
   * Обновить урок
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const lesson = await Lesson.find(params.id)
      
      if (!lesson) {
        return response.notFound({
          message: 'Урок не найден'
        })
      }
      
      const data = await request.validateUsing(updateLessonValidator)
      
      // Если data передана как объект - преобразуем
      if (data.data && typeof data.data === 'object') {
        data.data = JSON.stringify(data.data)
      }
      
      lesson.merge(data)
      await lesson.save()
      
      return response.ok(lesson)
    } catch (error: any) {
      console.error('Ошибка при обновлении урока:', error)
      
      if (error.messages) {
        return response.badRequest({
          errors: error.messages
        })
      }
      
      return response.internalServerError({
        message: 'Ошибка при обновлении урока'
      })
    }
  }

  /**
   * Удалить урок
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const lesson = await Lesson.find(params.id)
      
      if (!lesson) {
        return response.notFound({
          message: 'Урок не найден'
        })
      }
      
      // Удаляем урок из children главы
      // const chapter = await Chapter.find(lesson.chapterId)
      // if (chapter) {
      //   const children = chapter.getChildrenArray()
      //   chapter.children = children.filter(id => id !== `lesson${lesson.id}`)
      //   await chapter.save()
      // }
      
      // Удаляем урок из lessons подраздела
      // if (lesson.subchapterId) {
      //   const subchapter = await Subchapter.find(lesson.subchapterId)
      //   if (subchapter) {
      //     subchapter.lessons = (subchapter.lessons || []).filter(
      //       id => id !== lesson.id
      //     )
      //     await subchapter.save()
      //   }
      // }
      
      // await lesson.delete()
      
      return response.ok({
        message: 'Урок успешно удален'
      })
    } catch (error) {
      console.error('Ошибка при удалении урока:', error)
      return response.internalServerError({
        message: 'Ошибка при удалении урока'
      })
    }
  }

  /**
   * Получить данные урока
   */
  async getData({ params, response }: HttpContext) {
    try {
      const lesson = await Lesson.find(params.id)
      
      if (!lesson) {
        return response.notFound({
          message: 'Урок не найден'
        })
      }
      
      return response.ok(lesson.data)
    } catch (error) {
      console.error('Ошибка при получении данных урока:', error)
      return response.internalServerError({
        message: 'Ошибка при получении данных урока'
      })
    }
  }

  /**
   * Обновить данные урока
   */
  async updateData({ params, request, response }: HttpContext) {
    try {
      const lesson = await Lesson.find(params.id)
      
      if (!lesson) {
        return response.notFound({
          message: 'Урок не найден'
        })
      }
      
      const data = request.only(['data'])
      
      if (data.data) {
        if (typeof data.data === 'object') {
          lesson.data = JSON.stringify(data.data)
        } else {
          lesson.data = data.data
        }
        await lesson.save()
      }
      
      return response.ok(lesson.data)
    } catch (error) {
      console.error('Ошибка при обновлении данных урока:', error)
      return response.internalServerError({
        message: 'Ошибка при обновлении данных урока'
      })
    }
  }

  /**
   * Опубликовать/скрыть урок
   */
  async togglePublish({ params, request, response }: HttpContext) {
    try {
      const lesson = await Lesson.find(params.id)
      
      if (!lesson) {
        return response.notFound({
          message: 'Урок не найден'
        })
      }
      
      const { isPublished } = request.only(['isPublished'])
      
      if (isPublished !== undefined) {
        lesson.isPublished = isPublished
        await lesson.save()
      } else {
        lesson.isPublished = !lesson.isPublished
        await lesson.save()
      }
      
      return response.ok({
        message: `Урок ${lesson.isPublished ? 'опубликован' : 'скрыт'}`,
        isPublished: lesson.isPublished
      })
    } catch (error) {
      console.error('Ошибка при изменении статуса урока:', error)
      return response.internalServerError({
        message: 'Ошибка при изменении статуса урока'
      })
    }
  }
}
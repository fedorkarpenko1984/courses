// app/controllers/lessons_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Lesson from '#models/lesson'
import Course from '#models/course'
import Chapter from '#models/chapter'
import Subchapter from '#models/subchapter'
import { createLessonValidator, updateLessonValidator } from '#validators/lesson'

function getCHapterChildren(children: string | string[] | null | undefined): string[] {
  if (Array.isArray(children)) {
    return children
  } else if (typeof children === 'string') {
    try {
      const parsed = JSON.parse(children)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

export default class LessonsController {
  // инфо об уроке
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

  // создать
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createLessonValidator)
      
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
      let subchapter = null
      if (data.subchapterId) {
        subchapter = await Subchapter.find(data.subchapterId)
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

      if (!data.subchapterId) {
        let currentChapterChildrens = getCHapterChildren(chapter.children)
        chapter.children = [...currentChapterChildrens, `les${lesson.id}`]
        await chapter.save()      
      }
      if (data.subchapterId && subchapter) {
        const newLessons = subchapter.lessons || []
        subchapter.lessons = [...newLessons, lesson.id]
        subchapter.save()
      }

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

  // изменить
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

  // удалить
  async destroy({ params, response }: HttpContext) {
    try {
      const lesson = await Lesson.find(params.id)
      
      if (!lesson) {
        return response.notFound({
          message: 'Урок не найден'
        })
      }

      await lesson.delete()
      
      if (!lesson.subchapterId) {
        const chapter = await Chapter.find(lesson.chapterId)
        if (chapter) {
          const children = getCHapterChildren(chapter.children)
          chapter.children = children.filter(child => child !== `les${lesson.id}`)
          await chapter.save()
        }
      }
      
      
      if (lesson.subchapterId) {
        const subchapter = await Subchapter.find(lesson.subchapterId)
        if (subchapter) {
          subchapter.lessons = (subchapter.lessons || []).filter(
            id => id !== lesson.id
          )
          await subchapter.save()
        }
      }
            
      return response.status(204)
    } catch (error) {
      console.error('Ошибка при удалении урока:', error)
      return response.internalServerError({
        message: 'Ошибка при удалении урока'
      })
    }
  }
}
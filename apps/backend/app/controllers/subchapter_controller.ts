// app/controllers/subchapters_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Subchapter from '#models/subchapter'
import Chapter from '#models/chapter'
import Course from '#models/course'
import { createSubchapterValidator, updateSubchapterValidator } from '#validators/subchapter'

export default class SubchaptersController {

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createSubchapterValidator)
      
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
      
      const subchapter = await Subchapter.create({
        ...data,
        lessons: data.lessons || []
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

      chapter.children = [...currentChapterChildrens, `sub${subchapter.id}`]
      await chapter.save()
      
      return response.created(subchapter)
    } catch (error: any) {
      console.error('Ошибка при создании подраздела:', error)
      
      if (error.messages) {
        return response.badRequest({
          errors: error.messages
        })
      }
      
      return response.internalServerError({
        message: 'Ошибка при создании подраздела'
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const subchapter = await Subchapter.find(params.id)
      
      if (!subchapter) {
        return response.notFound({
          message: 'Подраздел не найден'
        })
      }
      
      const data = await request.validateUsing(updateSubchapterValidator)
      
      subchapter.merge(data)
      await subchapter.save()
      
      return response.ok(subchapter)
    } catch (error: any) {
      console.error('Ошибка при обновлении подраздела:', error)
      
      if (error.messages) {
        return response.badRequest({
          errors: error.messages
        })
      }
      
      return response.internalServerError({
        message: 'Ошибка при обновлении подраздела'
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const subchapter = await Subchapter.find(params.id)

      if (!subchapter) {
        return response.notFound({
          message: 'Подраздел не найден'
        })
      }

      const chapter = await Chapter.findOrFail(subchapter.chapterId)

      
      const chapterChildren = [...chapter.children]
      const subchapterIndexInChildren = chapterChildren.findIndex(child => child === `sub${params.id}`)

      chapterChildren.splice(subchapterIndexInChildren, 1)

      chapter.children = chapterChildren

      await subchapter.delete()

      chapter.save()
      
      return response.status(204)
    } catch (error) {
      console.error('Ошибка при удалении подраздела:', error)
      return response.internalServerError({
        message: 'Ошибка при удалении подраздела'
      })
    }
  }
}
import type { HttpContext } from '@adonisjs/core/http'
import Chapter from '#models/chapter'
import Course from '#models/course'

export default class ChaptersController {
  async index({ request, response }: HttpContext) {
    const courseId = request.input('courseId')
    const query = Chapter.query()
    
    if (courseId) {
      query.where('courseId', courseId)
    }
    
    const chapters = await query
    return response.json(chapters)
  }

  async show({ params, response }: HttpContext) {
    const chapter = await Chapter.findOrFail(params.id)
    return response.json(chapter)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'courseId',
      'title',
      'childrens',
      'isPublished'
    ])

    const course = await Course.findOrFail(data.courseId)
    
    const chapter = await Chapter.create(data)
    const currentCourseChapters = Array.isArray(course.chapters) ? course.chapters : []
    console.log('typeof buffer', currentCourseChapters)

    course.merge({
      ...course,
      chapters: [...currentCourseChapters, chapter.id]
    })

    await course.save()
    return response.status(201).json(chapter)
  }

  async update({ params, request, response }: HttpContext) {
    const chapter = await Chapter.findOrFail(params.id)
    const data = request.only([
      'title',
      'subchapters',
      'lessons',
      'isPublished'
    ])
    
    chapter.merge(data)
    await chapter.save()
    
    return response.json(chapter)
  }

  async destroy({ params, response }: HttpContext) {
    const chapter = await Chapter.findOrFail(params.id)
    await chapter.delete()
    
    return response.status(204)
  }
}
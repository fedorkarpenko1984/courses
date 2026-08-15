import vine from '@vinejs/vine'

export const createLessonValidator = vine.compile(
  vine.object({
    courseId: vine.number().positive(),
    chapterId: vine.number().positive(),
    subchapterId: vine.number().positive().optional(),
    title: vine.string().trim().minLength(1).maxLength(255),
    data: vine.any().optional(),
    isPublished: vine.boolean().optional(),
  })
)

export const updateLessonValidator = vine.compile(
  vine.object({
    courseId: vine.number().positive().optional(),
    chapterId: vine.number().positive().optional(),
    subchapterId: vine.number().positive().nullable().optional(),
    title: vine.string().trim().minLength(1).maxLength(255).optional(),
    data: vine.any().optional(),
    isPublished: vine.boolean().optional(),
  })
)
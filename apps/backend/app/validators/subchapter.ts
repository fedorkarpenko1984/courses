import vine from '@vinejs/vine'

export const createSubchapterValidator = vine.compile(
  vine.object({
    courseId: vine.number().positive(),
    chapterId: vine.number().positive(),
    title: vine.string().trim().minLength(1).maxLength(255),
    lessons: vine.array(vine.number()).optional(),
    isPublished: vine.boolean().optional(),
  })
)

export const updateSubchapterValidator = vine.compile(
  vine.object({
    courseId: vine.number().positive().optional(),
    chapterId: vine.number().positive().optional(),
    title: vine.string().trim().minLength(1).maxLength(255).optional(),
    lessons: vine.array(vine.number()).optional(),
    isPublished: vine.boolean().optional(),
  })
)
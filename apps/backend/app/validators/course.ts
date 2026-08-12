import vine from '@vinejs/vine'

export const createCourseValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(255),
    description: vine.string().minLength(10),
    chapters: vine.array(vine.number()).optional(),
    previewImage: vine.string().url().optional().nullable(),
    status: vine.enum(['draft', 'published', 'archive']).optional(),
    author: vine.string(),
  })
)

export const updateCourseValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(255).optional(),
    description: vine.string().minLength(10).optional(),
    chapters: vine.array(vine.number()).optional(),
    previewImage: vine.string().url().optional().nullable(),
    status: vine.enum(['draft', 'published', 'archive']).optional(),
    author: vine.string(),
  })
)

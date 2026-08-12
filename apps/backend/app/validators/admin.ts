import vine from '@vinejs/vine'

export const adminLoginValidator = vine.compile(
  vine.object({
    login: vine.string().minLength(3).maxLength(64).trim(),
    password: vine.string().minLength(8).maxLength(32),
  })
)
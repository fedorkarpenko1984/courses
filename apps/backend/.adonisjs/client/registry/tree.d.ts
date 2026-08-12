/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  accessTokens: {
    store: typeof routes['access_tokens.store']
    me: typeof routes['access_tokens.me']
  }
  course: {
    getAll: typeof routes['course.get_all']
    getCourse: typeof routes['course.get_course']
    create: typeof routes['course.create']
    update: typeof routes['course.update']
    destroy: typeof routes['course.destroy']
  }
  chapters: {
    index: typeof routes['chapters.index']
    show: typeof routes['chapters.show']
    store: typeof routes['chapters.store']
    update: typeof routes['chapters.update']
    destroy: typeof routes['chapters.destroy']
  }
}

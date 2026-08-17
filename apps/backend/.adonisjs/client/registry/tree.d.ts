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
    show: typeof routes['chapters.show']
    store: typeof routes['chapters.store']
    update: typeof routes['chapters.update']
    destroy: typeof routes['chapters.destroy']
  }
  subchapter: {
    store: typeof routes['subchapter.store']
    update: typeof routes['subchapter.update']
    destroy: typeof routes['subchapter.destroy']
  }
  lessons: {
    store: typeof routes['lessons.store']
    update: typeof routes['lessons.update']
    destroy: typeof routes['lessons.destroy']
  }
}

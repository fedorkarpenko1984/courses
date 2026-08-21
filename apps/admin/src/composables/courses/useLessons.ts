import { $fetch } from "@/helpers/myFetch";
import type { IChapter, ILesson, ISubchapter } from "@repo/types";
import type { Ref } from "vue";
import { useNotificationsStore } from "@/stores/notificationsStore"

const { addNotification } = useNotificationsStore()
export function useLessons(courseStructure: Ref<IChapter[]>, subchapters: Ref<ISubchapter[]>, lessons: Ref<ILesson[]>) {

  const createLesson = async (courseId: number, chapterId: number, title: string, subchapterId?: number) => {

    const response = await $fetch.post<ILesson>('/lesson',
      {
        courseId,
        chapterId,
        subchapterId,
        title: title,
        data: '',
        isPublished: false,
      }
    )
    if (response.status === 201) {
      const newLessons = [...lessons.value]
      newLessons.push(response.data)
      lessons.value = [...newLessons]
      addNotification({
        message: 'Урок успешно добавлен!',
        type: 'success'
      })
    }
    if (response.status === 201 && !subchapterId) {
      const chapter = courseStructure.value.find(ch => ch.id === chapterId)!
      const chapterIndex = courseStructure.value.findIndex(ch => ch.id === chapterId)
      const newCourseStructure = [...courseStructure.value]
      const newChapterChildren = [...chapter?.children]
      newChapterChildren.push(`les${response.data.id}`)
      newCourseStructure.splice(chapterIndex, 1, {
        ...chapter,
        children: newChapterChildren
      })
      courseStructure.value = [...newCourseStructure]
    }
    if (response.status === 201 && subchapterId) {
      const subchapter = subchapters.value.find(subch => subch.id === subchapterId)!
      subchapter.lessons.push(response.data.id)
      const newCourseStructure = [...courseStructure.value]
      courseStructure.value = [...newCourseStructure]
    }

  }

  const deleteLesson = async (lesson: ILesson) => {
    const response = await $fetch.delete(`/lesson/${lesson.id}`)

    if (response.status === 204) {
      const newLessons = [...lessons.value]
      const deletedLessonIndexInAllLessons = lessons.value.findIndex(les => les.id === lesson.id)
      newLessons.splice(deletedLessonIndexInAllLessons, 1)
      lessons.value = [...newLessons]
      addNotification({
        message: 'Урок успешно удалён!',
        type: 'success'
      })
    }
    if (response.status === 204 && !lesson.subchapterId) {
      const chapter = courseStructure.value.find(ch => ch.id === lesson.chapterId)!
      const chapterIndex = courseStructure.value.findIndex(ch => ch.id === lesson.chapterId)
      const newCourseStructure = [...courseStructure.value]
      const newChapterChildren = [...chapter?.children]
      const lessonIndexInChapterChildren = chapter?.children.findIndex(child => child === `les${lesson.id}`)!
      newChapterChildren.splice(lessonIndexInChapterChildren, 1)
      newCourseStructure.splice(chapterIndex, 1, {
        ...chapter,
        children: newChapterChildren
      })
      courseStructure.value = [...newCourseStructure]
    }
    if (response.status === 204 && lesson.subchapterId) {
      console.log('lesson from subchapter')
      const subchapter = subchapters.value.find(subch => subch.id === lesson.subchapterId)!
      subchapter.lessons = subchapter.lessons.filter(les => les !== lesson.id)
      const newCourseStructure = [...courseStructure.value]
      courseStructure.value = [...newCourseStructure]
    }
  }

  return {
    createLesson,
    deleteLesson
  }
}
import { $fetch } from "@/helpers/myFetch";
import type { ILesson } from "@repo/types";

export function useLessons() {

  const createLesson = async (courseId: number, chapterId: number, title: string, subchapterId?: number) => {

    const response = await $fetch.post<ILesson>('/lesson',
      {
        courseId,
        chapterId,
        subchapterId,
        title: title,
        content: '',
        isPublished: false,
      }
    )
    if (response.status === 201) {
      // const chapter = courseStructure.value.find(ch => ch.id === chapterId)!
      // const chapterIndex = courseStructure.value.findIndex(ch => ch.id === chapterId)
      // const newCourseStructure = [...courseStructure.value]
      // const newChapterChildren = [...chapter?.children]
      // newChapterChildren.push(`sub${response.data.id}`)
      // newCourseStructure.splice(chapterIndex, 1, {
      //   ...chapter,
      //   children: newChapterChildren
      // })
      // const newSubchapters = [...subchapters.value]
      // subchapters.value = [...newSubchapters, response.data]
      // courseStructure.value = [...newCourseStructure]
      // addNotification({
      //   message: 'Подаздел успешно добавлен!',
      //   type: 'success'
      // })
      // return true
    }
  }
  return {
    createLesson
  }
}
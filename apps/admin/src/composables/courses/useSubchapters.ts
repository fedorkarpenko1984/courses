import { $fetch } from "@/helpers/myFetch"
import type { IChapter, IChapterStructure, ISubchapter } from "@repo/types"
import { useNotificationsStore } from "@/stores/notificationsStore"
import type { Ref } from "vue"

const { addNotification } = useNotificationsStore()

export function useSubchapters(courseStructure: Ref<IChapter[]>) {

  const createSubchapter = async (courseId: number, chapterId: number, title: string) => {
    const response = await $fetch.post<ISubchapter>('/subchapter',
      {
        courseId,
        chapterId,
        title: title,
        lessons: [],
        isPublished: false,
      }
    )
    if (response.status === 201) {
      const chapter = courseStructure.value.find(ch => ch.id === chapterId)
      console.log('chapter', chapter)
      console.log('response.data', response.data)
      // chapter?.children.push(response.data)
      addNotification({
        message: 'Раздел успешно добавлен!',
        type: 'success'
      })
      return true
    }
  }

  return {
    createSubchapter
  }
}
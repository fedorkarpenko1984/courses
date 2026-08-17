import { $fetch } from "@/helpers/myFetch"
import type { IChapter, ISubchapter } from "@repo/types"
import { useNotificationsStore } from "@/stores/notificationsStore"
import { ref, type Ref } from "vue"

const { addNotification } = useNotificationsStore()

export function useSubchapters(courseStructure: Ref<IChapter[]>, subchapters: Ref<ISubchapter[]>) {

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
      const chapter = courseStructure.value.find(ch => ch.id === chapterId)!
      const chapterIndex = courseStructure.value.findIndex(ch => ch.id === chapterId)
      const newCourseStructure = [...courseStructure.value]
      const newChapterChildren = [...chapter?.children]
      newChapterChildren.push(`sub${response.data.id}`)
      newCourseStructure.splice(chapterIndex, 1, {
        ...chapter,
        children: newChapterChildren
      })
      const newSubchapters = [...subchapters.value]
      subchapters.value = [...newSubchapters, response.data]
      courseStructure.value = [...newCourseStructure]
      addNotification({
        message: 'Подаздел успешно добавлен!',
        type: 'success'
      })
      return true
    }
  }

  const editSubchapter = async (newSubchapter: ISubchapter) => {
    const response = await $fetch.put<ISubchapter>(`/subchapter/${newSubchapter.id}`, newSubchapter)
    if (response.status === 200) {
      addNotification({
        message: `Подраздел успешно изменён`,
        type: 'success'
      })
      const editedSubchapterIndex = subchapters.value.findIndex(subchapter => subchapter.id === newSubchapter.id)!
      const newSubchapters = [...subchapters.value]
      newSubchapters.splice(editedSubchapterIndex, 1, newSubchapter)
      subchapters.value = [...newSubchapters]
    }
  }

    // удалить раздел
  const deleteSubchapter = async (subchapter: ISubchapter) => {
    const response = await $fetch.delete(`/subchapter/${subchapter.id}`)

    console.log(response)
    if (response.status === 204) {
      const deletedSubchapterIndexInSubchapters = subchapters.value.findIndex(subch => subch.id === subchapter.id)!
      const parentChapter = courseStructure.value.find(chapter => chapter.id === subchapter.chapterId)!
      const parentChapterIndex = courseStructure.value.findIndex(chapter => chapter.id === subchapter.chapterId)!
      const subchapterIndexInChildren = parentChapter?.children.findIndex(child => child === `sub${subchapter.id}`)!
      const newParentChapterChildren = [...(parentChapter?.children || [])]
      newParentChapterChildren.splice(subchapterIndexInChildren, 1)
      const newCourseStructure = [...courseStructure.value]
      newCourseStructure.splice(parentChapterIndex, 1, {
        ...parentChapter,
        children: newParentChapterChildren
      })
      subchapters.value.splice(deletedSubchapterIndexInSubchapters, 1)
      courseStructure.value = [...newCourseStructure]
      addNotification({
        message: `Подраздел успешно удалён`,
        type: 'success'
      })
    }
  }

  return {
    createSubchapter,
    editSubchapter,
    deleteSubchapter
  }
}
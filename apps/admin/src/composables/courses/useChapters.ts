import { $fetch } from "@/helpers/myFetch"
import { isArraysValuesEquel } from "@/utils"
import type { IChapter, IChapterStructure, ICourse, ISubchapter } from "@repo/types"
import { type Ref, ref } from "vue"
import { useNotificationsStore } from "@/stores/notificationsStore"

const { addNotification } = useNotificationsStore()

export function useChapters(
  courseModel: Ref<ICourse>,
  courseStructure: Ref<IChapter[]>,
  courseData: Ref<ICourse | null>
) {

  const isChaptersDragndropDisabled = ref<boolean>(false)

  // добавить в курс раздел
  const addChapterToCourse = async (chapterTitle: string) => {

    const response = await $fetch.post<IChapter>('/chapter',
      {
        courseId: courseModel.value.id,
        title: chapterTitle,
        children: [],
        isPublished: false,
      }
    )
    if (response.status === 201) {
      courseStructure.value.push({
        ...response.data,
        children: []
      })
      addNotification({
        message: 'Раздел успешно добавлен!',
        type: 'success'
      })
      return true
    }
    return false
  }

  // удалить раздел
  const deleteChapter = async (chapterId: number) => {
    const response = await $fetch.delete(`/chapter/${chapterId}`)

    if (response.status === 204) {
      const deleteddChapterIndex = courseStructure.value.findIndex(chapter => chapter.id === chapterId)!
      console.log('deleteddChapterIndex', deleteddChapterIndex)
      courseStructure.value.splice(deleteddChapterIndex, 1)
      addNotification({
        message: `Раздел успешно удалён`,
        type: 'success'
      })
    }
  }

  let previousChaptersStructure: IChapter[] = []

  // начало перетаскивания раздела
  const onStartChapterDragging = () => {
    previousChaptersStructure = [...courseStructure.value]
  }

  // конец перетаскивания раздела
  const onEndChapterDragging = async () => {
    const newChaptersOrder = courseStructure.value.map(chapter => chapter.id)
    const previousChaptersOrder = previousChaptersStructure.map(chapter => chapter.id)
    if (isArraysValuesEquel(previousChaptersOrder, newChaptersOrder)) return
    isChaptersDragndropDisabled.value = true
    let response = null
    try {
      response = await $fetch.put<ICourse>(`/course/${courseModel.value.id}`, {
        ...courseData.value!,
        chapters: newChaptersOrder,
      })
    } 
    catch (error) {
    } finally {
      if (!response) {
        courseStructure.value = [...previousChaptersStructure]
      }
      isChaptersDragndropDisabled.value = false
    }
  }

  // редактирование раздела
  const editChapter = async (newInfo: Pick<IChapter, 'title' | 'isPublished'>, chapter: IChapter) => {
    const response = await $fetch.put<IChapter>(`/chapter/${chapter.id}`,
      {
        ...chapter,
        ...newInfo
      }
    )
    if (response.status === 200) {
      addNotification({
        message: `Раздел успешно изменён`,
        type: 'success'
      })
      const editedChapterIndex = courseStructure.value.findIndex(chapter => chapter.id === chapter.id)!
      const chapter = courseStructure.value.find(chapter => chapter.id === chapter.id)!
      const newChapter: IChapter = { ...chapter, ...newInfo }
      courseStructure.value.splice(editedChapterIndex, 1, newChapter)
    }
  }

  return {
    addChapterToCourse,
    onStartChapterDragging,
    onEndChapterDragging,
    deleteChapter,
    editChapter,
    isChaptersDragndropDisabled,
  }
}
import { $fetch } from "@/helpers/myFetch"
import type { TNotification } from "@/types/notifications"
import { isArraysValuesEquel } from "@/utils"
import type { IChapter, ICourse } from "@repo/types"
import { type Ref, ref } from "vue"

export function useCourseEdit(
  courseModel: Ref<ICourse>,
  courseStructure: Ref<IChapter[]>,
  isCreateModalOpen: Ref<boolean>,
  isDeleteModalOpen: Ref<boolean>,
  addNotification: (notification: TNotification) => {}
) {
  let courseData: ICourse | null = null
  const isDragndropDisabled = ref<boolean>(false)

  const getCourse = async (courseId: string) => {
    const response = await $fetch.get<{ course: ICourse, chapters: IChapter[] }>(`/course/${courseId}`)
    courseModel.value = response.data.course
    courseData = { ...courseModel.value }
    courseModel.value.chapters.forEach(chapterId => {
      const currentChapter = response.data.chapters.find(chapter => chapter.id === chapterId)
      if (currentChapter) {
        courseStructure.value.push(currentChapter)
      }
    })
  }

  const addChapterToCourse = async (chapterTitle: string) => {
    const response = await $fetch.post<IChapter>('/chapter',
      {
        courseId: courseModel.value.id,
        title: chapterTitle,
        children: [],
        isPublished: false,
      }
    )
    isCreateModalOpen.value = false
    if (response.status === 201) {
      courseStructure.value.push(response.data)
      addNotification({
        message: 'Раздел добавлен!',
        type: 'success'
      })
    }
  }

  const openDeleteModal = (data: { id: number, chapterId?: number }, deleteModalTitle: Ref<string>) => {
    const currentChapter = courseStructure.value.find(chapter => chapter.id === data.id)
    console.log('currentChapter', currentChapter)
    isDeleteModalOpen.value = true
  }

  const deleteChapter = async (chapterId: number) => {
    await $fetch.delete<ICourse>(`/course/${courseModel.value.id}`)
  }

  let previousChaptersOrder: number[] = []

  const onStartChapterDragging = () => {
    previousChaptersOrder = [...courseStructure.value.map(chapter => chapter.id)]
  }

  const onEndChapterDragging = async () => {
    const newChaptersOrder = courseStructure.value.map(chapter => chapter.id)
    if (isArraysValuesEquel(previousChaptersOrder, newChaptersOrder)) return
    isDragndropDisabled.value = true
    await $fetch.put<ICourse>(`/course/${courseModel.value.id}`, {
      ...courseData!,
      chapters: newChaptersOrder,
    })
    isDragndropDisabled.value = false
  }

  return {
    getCourse,
    addChapterToCourse,
    onStartChapterDragging,
    onEndChapterDragging,
    openDeleteModal,
    isDragndropDisabled
  }
}
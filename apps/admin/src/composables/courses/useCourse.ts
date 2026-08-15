import { $fetch } from "@/helpers/myFetch"
import type { IChapter, IChapterStructure, ICourse, ISubchapter } from "@repo/types"
import { type Ref, ref } from "vue"

const formatChapter = (chapter: IChapter, subchapters: ISubchapter[]): IChapterStructure => {
  const formatedChildren: ISubchapter[] = []
  chapter.children.forEach(child => {
    console.log('child', child)
    if (child.startsWith('sub')) {
      console.log(child.slice(3))
      const currentSubchapter = subchapters.find(sub => sub.id === Number(child.slice(3)))!
      formatedChildren.push(currentSubchapter)
    }
  })
  return {
    ...chapter,
    children: formatedChildren
  }
}

export function useCourse(
  courseModel: Ref<ICourse>,
  courseStructure: Ref<IChapter[]>,
  courseData: Ref<ICourse | null>
) {
  // онформация курса
  const getCourse = async (courseId: string) => {
    const response = await $fetch.get<{ course: ICourse, chapters: IChapter[], subchapters: ISubchapter[] }>(`/course/${courseId}`)
    courseModel.value = response.data.course
    courseData.value = { ...courseModel.value }
    courseModel.value.chapters.forEach(chapterId => {
      const currentChapter = response.data.chapters.find(chapter => chapter.id === chapterId)
      if (currentChapter) {
        courseStructure.value.push(currentChapter)
      }
    })
    return {
      subchapters: response.data.subchapters
    }
  }

  return {
    getCourse
  }
}
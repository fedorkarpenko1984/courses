import { $fetch } from "@/helpers/myFetch"
import type { IChapter, ICourse, ILesson, ISubchapter } from "@repo/types"
import { type Ref, ref } from "vue"

type TGetCourseResponse = {
  course: ICourse,
  chapters: IChapter[],
  subchapters: ISubchapter[],
  lessons: ILesson[]
}

export function useCourse(
  courseModel: Ref<ICourse>,
  courseStructure: Ref<IChapter[]>,
  courseData: Ref<ICourse | null>
) {
  // онформация курса
  const getCourse = async (courseId: string) => {
    const response = await $fetch.get<TGetCourseResponse>(`/course/${courseId}`)
    courseModel.value = response.data.course
    courseData.value = { ...courseModel.value }
    courseModel.value.chapters.forEach(chapterId => {
      const currentChapter = response.data.chapters.find(chapter => chapter.id === chapterId)
      if (currentChapter) {
        courseStructure.value.push(currentChapter)
      }
    })
    return {
      subchapters: response.data.subchapters,
      lessons:  response.data.lessons
    }
  }

  return {
    getCourse
  }
}
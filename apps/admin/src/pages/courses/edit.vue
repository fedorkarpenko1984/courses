<template>
  <div class="page">
    <h1>Курс {{ courseModel.title }}</h1>
    <h4>Автор: {{ courseModel.author }}, {{ courseBirthday }}</h4>
    <form class="course-form">
      <a-input
        v-model:value="courseModel.title"
        placeholder="Название"
        class="course-form__input"
      />
      <a-textarea
        v-model:value="courseModel.description"
        placeholder="Описание"
        :rows="4"
        class="course-form__input"
      />
      <CourseImageInput class="course-form__input" />
    </form>
    <div v-if="isCourseLoaded" class="course-structure">
      <h1>Структура курса</h1>
      <div>
        <VueDraggable
          v-model="courseStructure"
          :animation="150"
          :disabled="isChaptersDragndropDisabled"
          class="course-structure__chapters"
          @start="onStartChapterDragging"
          @end="onEndChapterDragging"
        >
          <CourseStructureChapter
            v-for="chapter in courseStructure"
            :key="chapter.id"
            :chapter="chapter"
            :subchapters="courseSubchapters"
            :lessons="courseLessons"
            @edit:chapter="openEditModal('chapter', { chapterId: chapter.id })"
            @delete:chapter="openDeleteModal('chapter', chapter.id)"
            @create:subchapter="openCreateModal('subchapter', { chapterId: chapter.id })"
            @create:lesson="openCreateModal('lesson', { chapterId: chapter.id })"
          >
            <template #children="{ chapterStructure }">
              <div
                v-for="child in chapterStructure"
                :key="child.id"
              >
                <CourseStructureSubchapter
                  v-if="child.type === 'subchapter'"
                  :subchapter="child"
                  :lessons="courseLessons"
                  @edit:subchapter="openEditModal('subchapter', { chapterId: chapter.id, subchapterId: child.id })"
                  @delete:subchapter="openDeleteModal('subchapter', child.id)"
                  @create:lesson="openCreateModal('lesson', { chapterId: chapter.id, subchapterId: child.id })"
                >
                  <template #lessons="{ lessons }">
                    <CourseStructureLesson
                      v-for="lesson in lessons"
                      :key="lesson.id"
                      :lesson="lesson"
                      @edit:lesson="router.push(`/courses/lesson/${lesson.id}`)"
                      @delete:lesson="openDeleteModal('lesson', lesson.id)"
                    />
                  </template>
                </CourseStructureSubchapter>

                <CourseStructureLesson
                  v-if="child.type === 'lesson'"
                  :lesson="child"
                  @edit:lesson="router.push(`/courses/lesson/${child.id}`)"
                  @delete:lesson="openDeleteModal('lesson', child.id)"
                />
              </div>
            </template>
          </CourseStructureChapter>
        </VueDraggable>
      </div>
      <div v-if="!courseStructure.length">Список разделов пуст</div>
      <a-button
        class="add-chapter"
        @click="openCreateModal('chapter')"
      >
        Новый раздел
      </a-button>
    </div>
    <ModalForCreatingCourseChildElement
      v-model="isCreateModalOpen"
      :type="createModalType"
      @add:chapter="addChapterToCourseWrapper"
      @add:subchapter="createSubchapterWrapper"
      @add:lesson="createLessonWrapper"
    />
    <ModalForEditCourseChildElement
      v-model="isEditModalOpen"
      :entity="entityForEdit"
      :type="entityForEditType"
      @save:chapter="editChapterWrapper"
      @save:subchapter="editSubchapterWrapper"
    />
    <ModalForDeletingCourseChildElement
      v-model="isDeleteModalOpen"
      :entity="entityForDelete"
      :type="entityForDeleteType"
      @delete:chapter="deleteChapterWrapper"
      @delete:subchapter="deleteSubchapterWrapper"
      @delete:lesson="deleteLessonWrapper"
    />
  </div>
</template>
<script lang="ts" setup>
import type { IChapter, ICourse, ISubchapter, ILesson } from '@repo/types'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/utils'
import CourseImageInput from '@/components/courses/CourseImageInput.vue'
import CourseStructureChapter from '@/components/courses/CourseStructureChapter.vue'
import { VueDraggable } from 'vue-draggable-plus'
import ModalForCreatingCourseChildElement from '@/components/courses/ModalForCreatingCourseChildElement.vue'
import { useChapters } from '@/composables/courses/useChapters'
import ModalForEditCourseChildElement from '@/components/courses/ModalForEditCourseChildElement.vue'
import type { TCourseChildEntity } from '@/types/courses'
import { useCourse } from '@/composables/courses/useCourse'
import ModalForDeletingCourseChildElement from '@/components/courses/ModalForDeletingCourseChildElement.vue'
import { useSubchapters } from '@/composables/courses/useSubchapters'
import CourseStructureSubchapter from '@/components/courses/CourseStructureSubchapter.vue'
import { useLessons } from '@/composables/courses/useLessons'
import CourseStructureLesson from '@/components/courses/CourseStructureLesson.vue'

const router = useRouter()
const route = useRoute()

const isCourseLoaded = ref<boolean>(false)

const isCreateModalOpen = ref<boolean>(false)
const isDeleteModalOpen = ref<boolean>(false)
const isEditModalOpen = ref<boolean>(false)

const entityForEdit = ref<null | IChapter | ISubchapter>(null)
const entityForEditType = ref<TCourseChildEntity>('chapter')

const entityForDelete = ref<null | IChapter | ISubchapter | ILesson>(null)
const entityForDeleteType = ref<TCourseChildEntity>('chapter')

const chapterIdForAddChildren = ref<number>(0)
const subchapterIdForAddLessons = ref<number | undefined>(undefined)

let courseData = ref<ICourse | null>(null);

const courseSubchapters = ref<ISubchapter[]>([])
const courseLessons = ref<ILesson[]>([])

const courseModel = ref<ICourse>({
  id: 0,
  title: '',
  description: '',
  author: '',
  status: 'draft',
  chapters: [],
  previewImage: '',
  createdAt: undefined
})
const courseStructure = ref<IChapter[]>([])

const {
  getCourse 
} = useCourse(
  courseModel,
  courseStructure,
  courseData
)

const {
  addChapterToCourse,
  deleteChapter,
  editChapter,
  onStartChapterDragging,
  onEndChapterDragging,
  isChaptersDragndropDisabled,
} = useChapters(
  courseModel,
  courseStructure,
  courseData
)

const {
  createSubchapter,
  editSubchapter,
  deleteSubchapter
} = useSubchapters(
  courseStructure,
  courseSubchapters
)

const {
  createLesson,
  deleteLesson
} = useLessons(
  courseStructure,
  courseSubchapters,
  courseLessons,
)

onMounted(async () => {
  if (route.params.id && typeof route.params.id === 'string') {
    const result = await getCourse(route.params.id)
    console.log(result)
    courseSubchapters.value = result.subchapters
    courseLessons.value = result.lessons
    isCourseLoaded.value = true
  }
})

const courseBirthday = computed<string>(() => {
  return courseModel.value.createdAt ? formatDate(courseModel.value.createdAt) : ''
})

type TModalType = 'chapter' | 'subchapter' | 'lesson'

const createModalType = ref<TModalType>('chapter')

const openCreateModal = (
  type: TModalType,
  options?: { chapterId?: number, subchapterId?: number }
) => {
  createModalType.value = type
  isCreateModalOpen.value = true
  if (type !== 'chapter') {
    chapterIdForAddChildren.value = options?.chapterId!
  }
  if (options?.subchapterId) {
    subchapterIdForAddLessons.value = options?.subchapterId
  }
}

const openEditModal = (
  type: TModalType,
  options?: { chapterId?: number, subchapterId?: number }
) => {
  if (type === 'chapter') {
    const currentChapter = courseStructure.value.find(chapter => chapter.id === options?.chapterId)
    entityForEdit.value = currentChapter!
    entityForEditType.value = 'chapter'
  }
  if (type === 'subchapter') {
    const currentSubchapter = courseSubchapters.value.find(subchapter => subchapter.id === options?.subchapterId)
    entityForEdit.value = currentSubchapter!
    entityForEditType.value = 'subchapter'
  }
  isEditModalOpen.value = true
}

const openDeleteModal = (
  type: TModalType,
  id: number
) => {
  entityForDeleteType.value = type
  if (type === 'chapter') {
    entityForDelete.value = courseStructure.value.find(chapter => chapter.id === id)!
  }
  if (type === 'subchapter') {
    entityForDelete.value = courseSubchapters.value.find(subchapter => subchapter.id === id)!
  }
  if (type === 'lesson') {
    entityForDelete.value = courseLessons.value.find(lesson => lesson.id === id)!
  }
  isDeleteModalOpen.value = true
}

const addChapterToCourseWrapper = async (title: string) => {
  await addChapterToCourse(title)
  isCreateModalOpen.value = false
}

const editChapterWrapper = async (newInfo: Pick<IChapter, 'title' | 'isPublished'>) => {
  if (!entityForEdit.value) return
  const newChapter = {
    ...(entityForEdit.value! as IChapter),
    ...newInfo
  }
  await editChapter(newChapter)
  isEditModalOpen.value = false
}

const deleteChapterWrapper = async () => {
  if (!entityForDelete.value) return
  await deleteChapter(entityForDelete.value?.id!)
  isDeleteModalOpen.value = false
}


const createSubchapterWrapper = async (title: string) => {
  await createSubchapter(courseData.value?.id!, chapterIdForAddChildren.value, title)
  isCreateModalOpen.value = false
}

const editSubchapterWrapper = async (newInfo: Pick<IChapter, 'title' | 'isPublished'>) => {
  if (!entityForEdit.value) return
  await editSubchapter({
    ...entityForEdit.value as ISubchapter,
    title: newInfo.title,
    isPublished: newInfo.isPublished
  })
  isEditModalOpen.value = false
}

const deleteSubchapterWrapper = async () => {
  if (!entityForDelete.value) return
  await deleteSubchapter(entityForDelete.value as ISubchapter)
  isDeleteModalOpen.value = false
}

const createLessonWrapper = async (title: string) => {
  await createLesson(courseData.value?.id!, chapterIdForAddChildren.value, title, subchapterIdForAddLessons.value)
  isCreateModalOpen.value = false
  subchapterIdForAddLessons.value = undefined
}

const deleteLessonWrapper = async () => {
  if (!entityForDelete.value) return
  await deleteLesson(entityForDelete.value as ILesson)
  isDeleteModalOpen.value = false
}
</script>

<style scoped lang="scss">
.course-form {
  margin-top: 32px;
  > * + * {
    margin-top: 12px;
  }

  &__input {
    width: 50%;
    display: block;
    resize: none;
  }
}

.course-structure {
  margin-top: 20px;

  &__chapters {
    display: flex;
    flex-direction: column;
    gap: 24px;

    &-children {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-top: 16px;
      padding-left: 100px;
    }
  }

  .add-chapter {
    margin-top: 20px;
  }
}
</style>

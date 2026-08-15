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
            @edit:chapter="openEditModal"
            @delete:chapter="openDeleteModal"
            @create:subchapter="openCreateModal('subchapter', { chapterId: chapter.id })"
            @create:lesson="openCreateModal('lesson', { chapterId: chapter.id })"
          >
            <template #children="{ chapterStructure }">
              <div
                v-for="child in chapterStructure"
                :key="child.id"
              >
                <CourseStructureSubchapter
                  v-if="child.lessons"
                  :id="child.id"
                  :title="child.title"
                  :is-published="child.isPublished"
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
    />
    <ModalForEditCourseChildElement
      v-model="isEditModalOpen"
      :entity="entityForEdit"
      :type="entityForEditType"
      @save:chapter="saveChapter"
    />
    <ModalForDeletingCourseChildElement
      v-model="isDeleteModalOpen"
      :entity="entityForDelete"
      :type="entityForDeleteType"
      @delete:chapter="deleteChapterWrapper"
    />
  </div>
</template>
<script lang="ts" setup>
import type { IChapter, ICourse, IChapterStructure, ISubchapter } from '@repo/types'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()

const isCourseLoaded = ref<boolean>(false)

const isCreateModalOpen = ref<boolean>(false)
const isDeleteModalOpen = ref<boolean>(false)
const isEditModalOpen = ref<boolean>(false)

const entityForEdit = ref<null | IChapter>(null)
const entityForEditType = ref<TCourseChildEntity>('chapter')

const entityForDelete = ref<null | IChapter>(null)
const entityForDeleteType = ref<TCourseChildEntity>('chapter')

const chapterIdForAddChildren = ref<number>(0)

let courseData = ref<ICourse | null>(null);

const courseSubchapters = ref<ISubchapter[]>([])

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
  getCourse 
} = useCourse(
  courseModel,
  courseStructure,
  courseData
)

const { createSubchapter } = useSubchapters(courseStructure)

onMounted(async () => {
  if (route.params.id && typeof route.params.id === 'string') {
    const result = await getCourse(route.params.id)
    console.log(result)
    courseSubchapters.value = result.subchapters
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
    console.log('chapterIdForAddChildren', chapterIdForAddChildren.value)
  }
}

const addChapterToCourseWrapper = async (title: string) => {
  await addChapterToCourse(title)
  isCreateModalOpen.value = false
}

const openDeleteModal = (data: { id: number, chapterId?: number }) => {
  const currentChapter = courseStructure.value.find(chapter => chapter.id === data.id)
  entityForDelete.value = currentChapter!
  isDeleteModalOpen.value = true
}

const deleteChapterWrapper = async () => {
  await deleteChapter(entityForDelete.value?.id!)
  isDeleteModalOpen.value = false
}

const openEditModal = (data: { id: number, chapterId?: number }) => {
  const currentChapter = courseStructure.value.find(chapter => chapter.id === data.id)
  entityForEdit.value = currentChapter!
  isEditModalOpen.value = true
}

const saveChapter = async (newInfo: Pick<IChapter, 'title' | 'isPublished'>) => {
  if (!entityForEdit) return
  await editChapter(newInfo, entityForEdit.value!)
  isEditModalOpen.value = false
}

const createSubchapterWrapper = async (title: string) => {
  console.log(chapterIdForAddChildren.value)
  console.log(courseData.value?.id)
  console.log(title)
  const response = await createSubchapter(courseData.value?.id!, chapterIdForAddChildren.value, title)
  console.log('createSubchapterWrapper', response)
  isCreateModalOpen.value = false
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

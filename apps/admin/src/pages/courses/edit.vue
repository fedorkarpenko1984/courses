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
    <div class="course-structure">
      <h1>Структура курса</h1>
      <div>
        <VueDraggable
          v-model="courseStructure"
          :animation="150"
          :disabled="isDragndropDisabled"
          class="course-structure__chapters"
          @start="onStartChapterDragging"
          @end="onEndChapterDragging"
        >
          <CourseStructureChapter 
            v-for="chapter in courseStructure"
            :key="chapter.id"
            :title="chapter.title"
            :id="chapter.id"
            :is-published="chapter.isPublished"
            type="chapter"
            @delete:chapter="openDeleteModal"
          >
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
      @add:chapter="addChapterToCourse"
    />
    <a-modal
      v-model:open="isDeleteModalOpen"
      :title="`sss`"
    >
      <template #footer>
        <a-button
          key="back"
          @click="isDeleteModalOpen = false"
        >
          отмена
        </a-button>
        <a-button
          key="submit"
          type="primary"
          @click="deleteChapter"
        >
          удалить
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import type { IChapter, ICourse } from '@repo/types'
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { formatDate } from '@/utils'
import CourseImageInput from '@/components/courses/CourseImageInput.vue'
import type { TNotification } from '@/types/notifications'
import CourseStructureChapter from '@/components/courses/CourseStructureChapter.vue'
import { VueDraggable } from 'vue-draggable-plus'
import ModalForCreatingCourseChildElement from '@/components/courses/ModalForCreatingCourseChildElement.vue'
import { useCourseEdit } from '@/composables/courses/edit'

const addNotification: (notification: TNotification) => {} = inject('addNotification')!

const route = useRoute()

const isCreateModalOpen = ref<boolean>(false)
const isDeleteModalOpen = ref<boolean>(false)

let courseData: ICourse | null = null;

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
  getCourse,
  addChapterToCourse,
  onStartChapterDragging,
  onEndChapterDragging,
  isDragndropDisabled,
  openDeleteModal,
} = useCourseEdit(
  courseModel,
  courseStructure,
  isCreateModalOpen,
  isDeleteModalOpen,
  addNotification,
)

onMounted(() => {
  if (route.params.id && typeof route.params.id === 'string') {
    getCourse(route.params.id)
  }
})

const courseBirthday = computed<string>(() => {
  return courseModel.value.createdAt ? formatDate(courseModel.value.createdAt) : ''
})

type TModalType = 'chapter' | 'subchapter' | 'lesson'

const createModalType = ref<TModalType>('chapter')
const openCreateModal = (
  type: TModalType,
  options?: { chapterId?: number, subchapterId: number }
) => {
  isCreateModalOpen.value = true
}

const deleteChapter = () => {}

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
    flex-direction:
    column; gap: 40px;
  }

  .add-chapter {
    margin-top: 20px;
  }
}
</style>

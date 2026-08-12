<template>
  <div class="page">
    <div class="top">
      <h1>Курсы</h1>
      <a-button
        type="primary"
        @click="isCreateModalOpen = true"
      >
        НОВЫЙ КУРС
      </a-button>
    </div>
    <CoursesTable
      v-if="courses.length"
      :courses="courses"
      @delete="openDeleteModal($event)"
      @edit="($event) => { router.push(`/courses/${$event}`) }"
    />
    <h3 v-else>Список курсов пуст</h3>
    <CourseCreateModal
      v-if="isCreateModalOpen"
      @close="isCreateModalOpen = false"
      @update:courses="updateCourses"
    />
    <a-modal
      v-model:open="isDeleteModalOpen"
      :title="`Вы уверены, что хотите удалить курс ${ textInDeletionModal }`"
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
          @click="deleteCourse"
        >
          удалить
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { $fetch } from '@/helpers/myFetch';
import { type ICourse } from '@repo/types';
import { onMounted, ref, inject } from 'vue';
import CourseCreateModal from '@/components/courses/CourseCreateModal.vue';
import CoursesTable from '@/components/courses/CoursesTable.vue';
import type { TNotification } from '@/types/notifications';
import { useRouter } from 'vue-router';

const router = useRouter()

const courses = ref<ICourse[]>([])

const isCreateModalOpen = ref<boolean>(false)
const isDeleteModalOpen = ref<boolean>(false)

const textInDeletionModal = ref<string>('')

const addNotification: (notification: TNotification) => {} = inject('addNotification')!

onMounted(async () => {
  getCourses()
})

const getCourses = async () => {
  const response = await $fetch.get<ICourse[]>('/course')
  courses.value = response.data
}

const updateCourses = () => {
  isCreateModalOpen.value = false;
  getCourses()
}

let courseIdForDelete = 0;
const openDeleteModal = (courseInfo: Pick<ICourse, 'id' | 'title'>) => {
  courseIdForDelete = courseInfo.id
  textInDeletionModal.value = courseInfo.title
  isDeleteModalOpen.value = true
}

const deleteCourse = async () => {
  console.log('courseIdForDelete', courseIdForDelete)
  const response = await $fetch.delete<ICourse[]>(`/course/${courseIdForDelete}`)
  isDeleteModalOpen.value = false;
  if (response.status === 200) {
    getCourses()
    addNotification({
      message: `Курс ${textInDeletionModal.value} успешно удалён`,
      type: 'success'
    });
  }
}
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  justify-content: space-between;
}
</style>
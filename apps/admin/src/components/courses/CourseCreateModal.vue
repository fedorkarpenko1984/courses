<template>
  <div
    class="course-create-modal-wrapper flex-center"
    @click="emit('close')"
  >
    <div
      class="course-create-modal"
      @click.stop
    >
      <a-space direction="vertical">
          <h3>Новый курс</h3>
          <CloseIcon
            class="course-create-modal__close-icon"
            @click="emit('close')"
          />
        <a-input
          v-model:value="title"
          placeholder="Название"
        />
        <a-input
          v-model:value="description"
          placeholder="Описание"
        />
        <a-button @click="createCourse">Создать</a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $fetch, getAuthHeader } from '@/helpers/myFetch';
import type { ICourse } from '@repo/types';
import { shallowRef, inject, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import CloseIcon from '@/icons/CloseIcon.vue';
import type { TNotification } from '@/types/notifications';

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'update:courses'): void
}>()

const addNotification: (notification: TNotification) => {} = inject('addNotification')!

const title = shallowRef<string>('')
const description = shallowRef<string>('')
const { login } = useAuthStore()

const createCourse = async () => {
  const response = await $fetch.post<ICourse>('/course',
    {
      title: title.value,
      description: description.value || 'Описание',
      chapters: [],
      status: "draft",
      author: login
    }
  )
  if (response.status === 201) {
    emit('update:courses')
    addNotification({
      message: 'Новый конкурс успешно создан!',
      type: 'success'
    })
  }
}
</script>

<style lang="scss" scoped>
.course-create-modal-wrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(10, 10, 10, 0.1);

  .course-create-modal {
    padding: 20px;
    border: 1px solid #CCC;
    border-radius: 20px;
    background-color: white;
    position: relative;

    &__close-icon {
      position: absolute;
      top: 16px;
      right: 16px;
      cursor: pointer;
    }
  }
}
</style>v
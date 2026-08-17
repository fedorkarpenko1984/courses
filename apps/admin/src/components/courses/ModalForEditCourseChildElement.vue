<template>
  <a-modal
    v-model:open="model"
    :title="createModalTitle"
  >
    <a-input
      v-model:value="title"
      placeholder="Название"
      class="course-form__input"
    />
    <a-select
      ref="select"
      v-model:value="status"
      style="width: 200px"
      :options="options"
      class="select"
    ></a-select>
    <template #footer>
      <a-button
        key="back"
        @click="model = false"
      >
        отмена
      </a-button>
      <a-button
        key="submit"
        type="primary"
        @click="saveEntity"
      >
        сохранить
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import type { IChapter, IChapterStructure, ISubchapter } from '@repo/types';
import { computed, ref, watch } from 'vue'
import type { TCourseChildEntity } from '@/types/courses';

const props = defineProps<{
  type: TCourseChildEntity,
  entity: null | IChapter | ISubchapter
}>()

const model = defineModel()
const title = ref<string>('')
const status = ref<number>(0)

const options = [
  {
    value: 0,
    label: 'Неопубликован',
  },
  {
    value: 1,
    label: 'Опубликован',
  },
]

const createModalTitle = computed<string>(() => {
  if (props.type === 'chapter') {
    return `Редактирование раздела ${props.entity?.title}`
  }
  if (props.type === 'subchapter') {
    return `Редактирование подраздела ${props.entity?.title}`
  }
  return ''
})

watch(props, (newProps) => {
  if (newProps.entity) {
    title.value = newProps.entity.title
    status.value = Number(newProps.entity.isPublished)
  }
})

const emit = defineEmits<{
  (e: 'save:chapter', payload: Pick<IChapter, 'title' | 'isPublished'>): void,
  (e: 'save:subchapter', payload: Pick<IChapter, 'title' | 'isPublished'>): void,
}>()

const saveEntity = () => {
  if (props.type === 'chapter') {
    emit('save:chapter', {
      title: title.value,
      isPublished: Boolean(status.value)
    })
  }
  if (props.type === 'subchapter') {
    emit('save:subchapter', {
      title: title.value,
      isPublished: Boolean(status.value)
    })
  }
}
</script>

<style>
.select {
  margin-top: 10px;
}
</style>
<template>
  <a-modal
    v-model:open="model"
    :title="deleteModalTitle"
  >
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
        @click="deleteEntity"
      >
        удалить
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import type { IChapter, ISubchapter } from '@repo/types';
import { computed } from 'vue'
import type { TCourseChildEntity } from '@/types/courses';

const props = defineProps<{
  type: TCourseChildEntity,
  entity: null | IChapter | ISubchapter
}>()

const model = defineModel()

const deleteModalTitle = computed<string>(() => {
  if (props.type === 'chapter') {
    return `Вы уверенны, что хотите удалить раздел ${props.entity?.title}`
  }
  if (props.type === 'subchapter') {
    return `Вы уверенны, что хотите удалить подраздел ${props.entity?.title}`
  }
  return ''
})

const emit = defineEmits<{
  (e: 'delete:chapter'): void,
  (e: 'delete:subchapter'): void,
}>()

const deleteEntity = () => {
  if (props.type === 'chapter') {
    emit('delete:chapter')
  }
  if (props.type === 'subchapter') {
    emit('delete:subchapter')
  }
}
</script>
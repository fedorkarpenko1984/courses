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
import type { IChapter, IChapterStructure } from '@repo/types';
import { computed } from 'vue'
import type { TCourseChildEntity } from '@/types/courses';

const props = defineProps<{
  type: TCourseChildEntity,
  entity: null | IChapter
}>()

const model = defineModel()

const deleteModalTitle = computed<string>(() => {
  if (props.type === 'chapter') {
    return `Вы уверенны, что хотите удалить ${props.entity?.title}`
  }
  return ''
})

const emit = defineEmits<{
  (e: 'delete:chapter'): void,
}>()

const deleteEntity = () => {
  if (props.type === 'chapter') {
    emit('delete:chapter')
  }
}
</script>
<template>
  <a-modal
    v-model:open="model"
    :title="createModalTitle"
  >
    <a-input
      v-model:value="createModalInput"
      placeholder="Название"
      class="course-form__input"
    />
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
        @click="addEntity"
      >
        создать
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  type: 'chapter' | 'subchapter' | 'lesson'
}>()

const model = defineModel()
const createModalInput = ref<string>('')

const createModalTitle = computed<string>(() => {
  if (props.type === 'chapter') {
    return 'Введите название нового раздела'
  }
  if (props.type === 'subchapter') {
    return 'Введите название нового подраздела'
  }
  if (props.type === 'lesson') {
    return 'Введите название нового урока'
  }
  return ''
})

const emit = defineEmits<{
  (e: 'add:chapter', payload: string): void
  (e: 'add:subchapter', payload: string): void
  (e: 'add:lesson', payload: string): void
}>()

const addEntity = () => {
  if (props.type === 'chapter') {
    emit('add:chapter', createModalInput.value)
    createModalInput.value = ''
  }
  if (props.type === 'subchapter') {
    emit('add:subchapter', createModalInput.value)
    createModalInput.value = ''
  }
  if (props.type === 'lesson') {
    emit('add:lesson', createModalInput.value)
    createModalInput.value = ''
  }
}
</script>
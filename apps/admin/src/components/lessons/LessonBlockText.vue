<template>
  <div class="lesson-block-text">
    <h3>{{ index + 1 }} ТЕКСТОВЫЙ БЛОК</h3>
    <div
      class="lesson-block-text__delete"
      @click="emit('delete', block.id)"
    >
      <DeleteOutlined />
    </div>
    <QuillEditor
      v-model:content="content"
      theme="snow"
      toolbar="full"
      content-type="html"
    />
  </div>
</template>

<script setup lang="ts">
import type { ILessonBlockText } from '@/types/lesson'
import { onMounted, ref, shallowRef, watch } from 'vue';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { DeleteOutlined } from '@ant-design/icons-vue';

const props = defineProps<{
  block: ILessonBlockText,
  initial: string
  index: number
}>()

console.log(props)
const emit = defineEmits<{
  (e: 'update', payload: string): void
  (e: 'delete', payload: string): void
}>()

const content = shallowRef<string>(props.initial);

watch(content, (newContent) => {
  emit('update', newContent)
})

// onMounted(() => {
// })
</script>

<style lang="scss" scoped>
.lesson-block-text {
  width: 100%;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  position: relative;

  &__delete {
    position: absolute;
    top: 10px;
    right: 10px;
    color: red;
    cursor: pointer;
  }
}
:deep(.ql-toolbar.ql-snow + .ql-container.ql-snow) {
  min-height: 120px;
}
</style>
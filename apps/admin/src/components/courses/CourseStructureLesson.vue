<template>
  <div class="course-structure-lesson">
    <div class="course-structure-lesson__prefix">
      урок
    </div>
    <div class="course-structure-lesson__content">
      {{ lesson.title }}
      <div
        class="status"
        :style="`background: ${ lesson.isPublished ? 'rgb(101, 233, 134)' : 'grey'}`"
      >
        {{ `${ lesson.isPublished ? '' : 'не'}опубликован` }}
      </div>
      <div class="controls" @click.stop>
        <div
          style="color: lightseagreen"
          @click="emit('edit:lesson', { id: lesson.id })"
        >
          <EditFilled />
        </div>
        <div
          style="color: red"
          @click="emit('delete:lesson')"
        >
          <DeleteOutlined />
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { ILesson } from '@repo/types';
import { DeleteOutlined, EditFilled } from '@ant-design/icons-vue';
const props = defineProps<{
  lesson: ILesson
}>()

const emit = defineEmits<{
  (e: 'edit:lesson', payload: { id: number }): void
  (e: 'delete:lesson'): void
}>()
</script>

<style scoped lang="scss">
.course-structure-lesson {
  width: 700px;
  position: relative;

  &__content {
    display: flex;
    align-items: center;
    height: 36px;
    font-size: 14px;
    border: 1px solid rgb(204, 204, 204);
    padding: 0 16px;
    border-radius: 6px;
    position: relative;

    .status {
      background: rgb(101, 233, 134);
      color: white;
      position: absolute;
      padding: 2px;
      right: 70px;
      font-size: 12px;
      border-radius: 4px;
    }
    
    .controls {
      display: flex;
      gap: 10px;
      position: absolute;
      right: 10px;
      & > * {
        cursor: pointer;
      }
    }
  }

  &__prefix {
    position: absolute;
    left: 16px;
    top: -8px;
    font-size: 9px;
    background: white;
    padding: 1px 6px;
    z-index: 1;
    color:grey;
    border: 1px solid #aaa;
    border-radius: 4px;
    text-transform: uppercase;
  }

  .actions {
    position: absolute;
    top: 8px;
    right: 0;
    transform: translateX(100%);
  }
}
</style>

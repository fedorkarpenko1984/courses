<template>
  <div class="course-structure-chapter">
    <div class="course-structure-chapter__prefix">
      подраздел
    </div>
    <div class="course-structure-chapter__content">
      {{ title }}
      <div
        class="status"
        :style="`background: ${isPublished ? 'rgb(101, 233, 134)' : 'grey'}`"
      >
        {{ `${isPublished ? '' : 'не'}опубликован` }}
      </div>
      <div class="controls" @click.stop>
        <div
          style="color: lightseagreen"
          @click="emit('edit:subchapter', { id })"
        >
          <EditFilled />
        </div>
        <div
          style="color: red"
          @click="emit('delete:subchapter', { id })"
        >
          <DeleteOutlined />
        </div>
      </div>
    </div>
      <slot />
    <div class="actions">
      <div class="add-lesson">
        <div class="add-lesson__text">добавить урок</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IChapter } from '@repo/types';
import { DeleteOutlined, EditFilled } from '@ant-design/icons-vue';
const props = defineProps<{
  id: number,
  title: string,
  chapterId?: number,
  isPublished: boolean,
}>()

const emit = defineEmits<{
  (e: 'delete:subchapter', payload: { id: number, chapterId?: number }): void
  (e: 'edit:subchapter', payload: { id: number, chapterId?: number }): void
  (e: 'create:lesson'): void
}>()
</script>

<style scoped lang="scss">
.course-structure-chapter {
  width: 600px;
  position: relative;

  &__content {
    display: flex;
    align-items: center;
    height: 42px;
    font-size: 18px;
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
    top: -10px;
    font-size: 16px;
    background: white;
    padding: 0 4px;
    z-index: 1;
    color:grey;
  }
  .add-lesson {
    position: relative;
    font-size: 12px;
    margin-top: 4px;
    &__text {
      background: #aaa;
      padding: 2px 4px;
      width: fit-content;
      color: white;
      border-radius: 0px 6px 6px 0px;
    }
    cursor: pointer;
  }
  .actions {
    position: absolute;
    top: 8px;
    right: 0;
    transform: translateX(100%);
  }
}
</style>

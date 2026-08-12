<template>
  <div class="course-structure-chapter">
    <div class="course-structure-chapter__prefix">
      раздел
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
          @click="emit('edit', id)"
        >
          <EditFilled />
        </div>
        <div
          style="color: red"
          @click="deleteIconHandler"
        >
          <DeleteOutlined />
        </div>
      </div>
    </div>
      <slot />
    <div class="add-subchapter">
      <div class="add-subchapter__text">добавить подраздел</div>
    </div>
    <div class="add-lesson">
      <div class="add-lesson__text">добавить урок</div>
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
  type: 'chapter' | 'subchapter'
}>()

const emit = defineEmits<{
  (e: 'delete:chapter', payload: { id: number, chapterId?: number }): void
  (e: 'edit', payload: number): void,
}>()

const deleteIconHandler = () => {
  console.log('deleteIconHandler')
  if (props.type === 'chapter') {
    emit('delete:chapter', { id: props.id })
  }
}
</script>

<style scoped lang="scss">
.course-structure-chapter {
  width: 600px;
  position: relative;

  &__content {
    display: flex;
    align-items: center;
    height: 50px;
    font-size: 20px;
    border: 1px solid rgb(219, 219, 219);
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
  .add-subchapter, .add-lesson {
    position: relative;
    margin-left: 50px;
    font-size: 12px;
    padding: 4px 16px;
    margin-top: 4px;
    &__text {
      background: #eee;
      padding: 2px 4px;
      width: fit-content;
    }
    
    cursor: pointer;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: -4px;
      height: calc(100% + 4px);
      width: 1px;
      background: gray;
    }
    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      height: 1px;
      width: 12px;
      background: gray;
    }
  }
  .add-lesson {
    &::before {
      content: "";
      height: calc(50% + 4px);
    }
  }
}
</style>

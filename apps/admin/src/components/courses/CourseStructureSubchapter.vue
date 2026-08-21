<template>
  <div class="course-substructure-chapter">
    <div class="course-substructure-chapter__prefix">
      подраздел
    </div>
    <div class="course-substructure-chapter__content">
      {{ subchapter.title }}
      <div
        class="status"
        :style="`background: ${ subchapter.isPublished ? 'rgb(101, 233, 134)' : 'grey'}`"
      >
        {{ `${ subchapter.isPublished ? '' : 'не'}опубликован` }}
      </div>
      <div class="controls" @click.stop>
        <div
          style="color: lightseagreen"
          @click="emit('edit:subchapter', { id: subchapter.id })"
        >
          <EditFilled />
        </div>
        <div
          style="color: red"
          @click="emit('delete:subchapter', { id: subchapter.id })"
        >
          <DeleteOutlined />
        </div>
      </div>
    </div>
    <VueDraggable
      v-model="subchapterLessonsStructure"
      :animation="150"
      class="course-substructure-chapter__lessons"
      :disabled="isDragndropDisabled"
      @start="startDraging"
      @end="endDraging"
    >
      <slot :lessons="subchapterLessonsStructure" name="lessons" />
    </VueDraggable>
    <div class="actions">
      <div class="add-lesson" @click="emit('create:lesson')">
        <div class="add-lesson__text">добавить урок</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ILesson, ISubchapter } from '@repo/types';
import { DeleteOutlined, EditFilled } from '@ant-design/icons-vue';
import { onMounted, ref, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus'
import { isArraysValuesEquel } from '@/utils';
import { $fetch } from '@/helpers/myFetch';

const props = defineProps<{
  subchapter: ISubchapter,
  lessons: ILesson[]
}>()

const subchapterLessonsStructure = ref<ILesson[]>([])

const setLessonsStructure = () => {
  const newLessonsStructure: ILesson[] = []
  props.subchapter.lessons.forEach(lessonId => {
    const lesson = props.lessons.find(les => les.id === lessonId)!
    newLessonsStructure.push(lesson)
  })
  subchapterLessonsStructure.value = [...newLessonsStructure]
}

onMounted(() => {
  setLessonsStructure()
})

const emit = defineEmits<{
  (e: 'delete:subchapter', payload: { id: number }): void
  (e: 'edit:subchapter', payload: { id: number }): void
  (e: 'create:lesson'): void
}>()

let previousSubchapterLessonsStructure: ILesson[] = []
let isDragndropDisabled = ref<boolean>(false)

watch(props, () => {
  setLessonsStructure()
})

const startDraging = () => {
  previousSubchapterLessonsStructure = [...subchapterLessonsStructure.value]
}

const endDraging = async () => {
  const newSubhaptersLessonsrenOrder = subchapterLessonsStructure.value.map(lesson => lesson.id)
  const previousSubchapterLessonsrenOrder = previousSubchapterLessonsStructure.map(lesson => lesson.id)
  if (isArraysValuesEquel(previousSubchapterLessonsrenOrder, newSubhaptersLessonsrenOrder)) return
  console.log('previousSubchapterChildrenOrder', previousSubchapterLessonsrenOrder)
  console.log('newSubhaptersChildrenOrder', newSubhaptersLessonsrenOrder)
  isDragndropDisabled.value = true
  let response = null
  try {
    response = await $fetch.put<ISubchapter>(`/subchapter/${props.subchapter.id}`, {
      ...props.subchapter,
      lessons: newSubhaptersLessonsrenOrder,
    })
  } 
  catch (error) {
  } finally {
    if (!response) {
      subchapterLessonsStructure.value = [...previousSubchapterLessonsStructure]
    }
    isDragndropDisabled.value = false
  }
}
</script>

<style scoped lang="scss">
.course-substructure-chapter {
  width: 700px;
  position: relative;
  
  &__lessons {
    padding-left: 100px;
    margin-top: 9px;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  &__content {
    display: flex;
    align-items: center;
    height: 42px;
    font-size: 18px;
    border: 1px solid rgb(204, 204, 204);
    padding: 0 16px;
    border-radius: 6px;
    position: relative;

    &:hover {
      border-color: rgb(170, 171, 172); 
    }

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
    font-size: 10px;
    background: white;
    padding: 1px 6px;
    z-index: 1;
    color:grey;
    border: 1px solid #aaa;
    border-radius: 4px;
    text-transform: uppercase;
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

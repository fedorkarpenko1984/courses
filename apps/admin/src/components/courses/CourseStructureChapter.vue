<template>
  <div class="course-structure-chapter">
    <div class="course-structure-chapter__prefix">
      раздел
    </div>
    <div class="course-structure-chapter__content">
      {{ chapter.title }}
      <div
        class="status"
        :style="`background: ${ chapter.isPublished ? 'rgb(101, 233, 134)' : 'grey'}`"
      >
        {{ `${ chapter.isPublished ? '' : 'не'}опубликован` }}
      </div>
      <div class="controls" @click.stop>
        <div
          style="color: lightseagreen"
          @click="emit('edit:chapter', { id: chapter.id })"
        >
          <EditFilled />
        </div>
        <div
          style="color: red"
          @click="emit('delete:chapter', { id: chapter.id })"
        >
          <DeleteOutlined />
        </div>
      </div>
    </div>
    <VueDraggable
      v-model="chapterStructure"
      :animation="150"
      class="course-structure-chapter__children"
    >
      <slot :chapterStructure="chapterStructure" name="children" />
    </VueDraggable>
    <div class="actions">
      <div
        class="add-subchapter"
        @click="emit('create:subchapter')"
      >
        <div class="add-subchapter__text">добавить подраздел</div>
      </div>
      <div
        class="add-lesson"
        @click="emit('create:lesson')"
      >
        <div class="add-lesson__text">добавить урок</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IChapter, ILesson, ISubchapter } from '@repo/types';
import { DeleteOutlined, EditFilled } from '@ant-design/icons-vue';
import { onMounted, ref, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus'

interface ISubchapterAdmin extends ISubchapter {
  type: 'subchapter'
}

interface ILessonAdmin extends ILesson {
  type: 'lesson'
}

const props = defineProps<{
  chapter: IChapter
  subchapters: ISubchapter[],
  lessons: ILesson[]
}>()

const chapterStructure = ref<Array<ISubchapterAdmin | ILessonAdmin>>([])

function setChapterStructure() {
  const newChapterStructure: Array<ISubchapterAdmin | ILessonAdmin> = []
  props.chapter.children.forEach(child => {
    if (child.startsWith('sub')) {
      const currentSubchapter = props.subchapters.find(sub => sub.id === Number(child.slice(3)))!
      newChapterStructure.push({...currentSubchapter, type: 'subchapter'})
    }
    if (child.startsWith('les')) {
      const currentLesson = props.lessons.find(lesson => lesson.id === Number(child.slice(3)))!
      newChapterStructure.push({ ...currentLesson, type: 'lesson'})
    }
  })
  chapterStructure.value = [...newChapterStructure]
}

onMounted(() => {
  setChapterStructure()
})

const emit = defineEmits<{
  (e: 'delete:chapter', payload: { id: number }): void
  (e: 'edit:chapter', payload: { id: number, chapterId?: number }): void
  (e: 'create:subchapter'): void
  (e: 'create:lesson'): void
}>()

watch(props, (newProps) => {
  console.log('newProps', newProps)
  setChapterStructure()
})
</script>

<style scoped lang="scss">

.course-structure-chapter {
  width: 700px;
  position: relative;

  &__children {
    margin-top: 12px;
    padding-left: 100px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

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
    top: -8px;
    font-size: 12px;
    background: white;
    padding: 1px 6px;
    text-transform: uppercase;
    z-index: 1;
    color:grey;
    border: 1px solid #aaa;
    border-radius: 4px;
  }
  .add-subchapter, .add-lesson {
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
    top: 0;
    right: 0;
    transform: translateX(100%);
  }
}
</style>

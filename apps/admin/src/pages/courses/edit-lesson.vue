<template>
  <div class="page lesson-page">
    <h1>Редактирование урока</h1>
    <h4>Название</h4>
    <a-input
      v-model:value="lessonTitle"
      placeholder="Название"
      class="lesson__input"
    />
    <div class="lesson-page__blocks">
      <h3 v-if="!lessonBlocks.length">Список блоков пуст</h3>
      <div
        v-for="block, index in lessonBlocks"
        :key="block.id"
      >
        <LessonBlockText
          v-if="block.type === 'text'"
          :block="block"
          :initial="block.content"
          :index="index"
          @update="($event) => { textBlockUpdateHandler($event, block.id) }"
          @delete="deleteBlock"
        />
        <LessonBlockVideo
          v-if="block.type === 'video'"
          :block="block"
          :initial="formatVideoContent(block.content)"
          :index="index"
          @update="($event) => updateVideoBlock($event, block.id)"
          @delete="deleteBlock"
        />
      </div>
    </div>
    <div class="lesson-page__add-block">
      <a-button
        class="lesson-page__add-block-button"
        @click="addBlock"
      >
        Добавить
      </a-button>
      <a-select
        ref="select"
        v-model:value="selectBlockModel"
        :options="blockSelectOptions"
        class="lesson-page__select"
      />
    </div>
    <a-button
      type="primary"
      size="large"
      class="lesson-page__save-lesson"
      @click="saveLesson"
    >
      Сохранить урок
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { $fetch } from '@/helpers/myFetch';
import type { ILesson } from '@repo/types';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import LessonBlockText from '@/components/lessons/LessonBlockText.vue';
import LessonBlockVideo from '@/components/lessons/LessonBlockVideo.vue';
import type { TLessonBlockType, TLessonBlockCommon } from '@/types/lesson';

const blockSelectOptions: {
  value: TLessonBlockType,
  label: string,
}[] = [
  {
    value: 'text',
    label: 'текстовый блок'
  },
  {
    value: 'video',
    label: 'видео'
  }
]

const route = useRoute()

const lessonTitle = ref<string>('')
const lessonBlocks = ref<TLessonBlockCommon[]>([])

const selectBlockModel = ref<TLessonBlockType>('text')

const formatData = (data: string | any[]) => {
  if (!data) return []
  if (Array.isArray(data)) {
    console.log(data)
    return data.map(dataBlock => ({
      id: (Math.random() * 10).toString() + Date.now(),
      type: dataBlock?.type || 'text',
      content: dataBlock?.content || ''
    }) as TLessonBlockCommon)
  }
  return []
}

let lesson: ILesson | null = null

const getLesson = async () => {
  const response = await $fetch.get<ILesson>(`/lesson/${route.params.id}`)
  lessonTitle.value = response.data.title
  lessonBlocks.value =  formatData(response.data.data!)
  lesson = response.data
}
getLesson()

const getInitValue = (type: TLessonBlockType): TLessonBlockCommon => {
  const initValue: Pick<TLessonBlockCommon, 'id' | 'type'> = {
    type,
    id: (Math.random() * 10).toString() + Date.now(),
  }
  return {
    ...initValue,
    content: ''
  }
}

const addBlock = () => {
  const newBlock = getInitValue(selectBlockModel.value)
  if (newBlock) lessonBlocks.value.push(newBlock)
}

const isBlocksValid = () => {
  return lessonBlocks.value.reduce((result, item) => {
    if (!item.content || item.content === 'invalid') {
      return false
    }
    return result
  }, true)
}

const saveLesson = async () => {
  if (!isBlocksValid()) return
  console.log('is valid') 
  // const response = await $fetch.put(`/lesson/${lesson?.id}`, {
  //   ...lesson,
  //   title: lessonTitle.value,
  //   data: JSON.stringify(lessonBlocks.value)
  // })
  // console.log(response)
}

const textBlockUpdateHandler = (newContent: string, id: string) => {
  const block = lessonBlocks.value.find(block => block.id === id)
  if (block) block.content = newContent
}

const updateVideoBlock = (newContent: File | 'invalid', id: string) => {
  console.log('newContent', newContent)
  console.log('id', id)
  const block = lessonBlocks.value.find(block => block.id === id)
  if (block) block.content = newContent
}

const formatVideoContent = (content: string | File): string => typeof content === 'string' ? content : content.name

const deleteBlock = (id: string) => {
  const blockIndex = lessonBlocks.value.findIndex(block => block.id === id)
  if (blockIndex !== -1) {
    lessonBlocks.value.splice(blockIndex, 1)
  }
}

</script>

<style scoped lang="scss">
.lesson-page {
  &__input {
    width: 500px;
  }

  &__select {
    width: 240px;
  }

  &__add-block {
    margin-top: 20px;
    display: flex;
    gap: 4px;
  }

  &__blocks {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__save-lesson {
    margin-top: 40px;
  }
}
</style>

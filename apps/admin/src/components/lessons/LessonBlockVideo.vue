<template>
  <div class="lesson-block-video">
    <h3>{{ index + 1 }} ВИДЕО</h3>
    <div
      class="lesson-block-video__delete"
      @click="emit('delete', block.id)"
    >
      <DeleteOutlined />
    </div>
    <div
      class="video-upload"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div
        v-if="file && isFileValid"
        class="video-upload__file-name"
      >
        {{ file?.name }}
      </div>
      <div
        v-if="file && isFileValid"
        class="video-upload__file-size"
      >
        {{ formatFileSize(file?.size) }}
      </div>
      <a-button
        v-if="file && isFileValid"
        class="video-upload__file-preview"
      >
        Превью
      </a-button>
      <div
        v-if="!isFileValid && file"
        class="video-upload__invalid-file"
      >
        Файл {{ file.name }} не является корректным видеоформатом
      </div>
      <div v-if="!file" class="video-upload__placeholder">
        <div
          class="placeholder-icon"
          :style="`color: ${ isHovered ? 'rgb(108, 108, 253)' : '#ddd' }`"
        >
          <VideoCameraOutlined  />
        </div>
        <h4>Выбирите или перетащите видео</h4>
      </div>
      <input
        type="file"
        class="video-upload__input"
        @change="changeHandler"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ILessonBlockVideo } from '@/types/lesson';
import { ref } from 'vue';
import { DeleteOutlined, VideoCameraOutlined } from '@ant-design/icons-vue';

const extensions = ['mp4', 'mov', 'wmv', 'avi']
const file = ref<File | null>()
const isHovered = ref<boolean>(false)
const isFileValid = ref<boolean>(true)

const props = defineProps<{
  block: ILessonBlockVideo
  initial: string
  index: number
}>()

const emit = defineEmits<{
  (e: 'update', payload: File | 'invalid'): void
  (e: 'delete', payload: string): void
}>()


const changeHandler = (e: Event) => {
  const target = e.target as HTMLInputElement;
  console.log(target.files)
  if (!target.files || !target.files[0]) return
  const uploadedFile = target.files[0]
  const extension = uploadedFile.name.split('.')[(uploadedFile.name.split('.').length - 1)]
  file.value = uploadedFile
  if (extension && extensions.includes(extension)) {
    isFileValid.value = true
    emit('update', file.value)
  } else {
    isFileValid.value = false
    emit('update', 'invalid')
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style scoped lang="scss">
.lesson-block-video {
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

  .video-upload {
    width: 400px;
    height: 300px;
    border: 1px solid #ddd;
    border-radius: 8px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    transition: all 0.3s;

    &__placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .placeholder-icon {
        color: rgb(159, 159, 207);
        font-size: 40px;
        transition: all 0.3s;
      }
    }

    &:hover {
      border: 1px dashed rgb(108, 108, 253);
    }

    &__input {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      cursor: pointer;
      opacity: 0;
    }

    &__file-name {
      color: rgb(22, 173, 22);
      font-size: 18px;
      padding: 0 20px;
      text-align: center;
    }
    &__file-size {
      color: rgb(32, 151, 32);
      font-size: 16px;
      margin-top: 10px;
      text-align: center;
    }
    &__file-preview {
      margin-top: 20px;
    }
    &__invalid-file {
      color: red;
      font-size: 16px;
      text-align: center;
    }
  }
}
</style>
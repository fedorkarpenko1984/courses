<template>
  <div
    class="image-input"
    :class="{ 'image-input--has-image': !!previewUrl, 'image-input--dragging': isDragging }"
    @click="triggerFileInput"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="image-input__native"
      @change="onFileChange"
    />

    <img
      v-if="previewUrl"
      :src="previewUrl"
      alt="Preview"
      class="image-input__preview"
    />

    <div v-else class="image-input__placeholder">
      <slot name="placeholder">
        <span class="image-input__icon">📷</span>
        <span class="image-input__text">Выберите изображение</span>
      </slot>
    </div>

    <button
      v-if="previewUrl"
      type="button"
      class="image-input__remove"
      @click.stop="removeImage"
      aria-label="Удалить изображение"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch } from 'vue';

interface Props {
  modelValue?: File | null;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void;
  (e: 'change', value: File | null): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const isDragging = ref(false);

const setPreviewFromFile = (file: File | null) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  }
};

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;
  handleFile(file);
  input.value = '';
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const onDragOver = () => {
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) {
    handleFile(file);
  }
};

const handleFile = (file: File | null) => {
  setPreviewFromFile(file);
  emit('update:modelValue', file);
  emit('change', file);
};

const removeImage = () => {
  handleFile(null);
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal === null && previewUrl.value) {
      setPreviewFromFile(null);
    }
  },
);

// Очистка памяти при размонтировании компонента
onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<style scoped>
.image-input {
  position: relative;
  border: 2px dashed #c0c4cc;
  border-radius: 12px;
  background-color: #f5f7fa;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s, background-color 0.2s;
  user-select: none;
}

.image-input:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.image-input--has-image {
  border-style: solid;
  border-color: #dcdfe6;
}

.image-input--dragging {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.image-input__native {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Превью занимает всю площадь элемента */
.image-input__preview {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover; /* ← ключевое свойство: изображение растягивается по всей площади */
  object-position: center;
}

.image-input__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #909399;
  gap: 8px;
}

.image-input__icon {
  font-size: 32px;
}

.image-input__text {
  font-size: 14px;
}

.image-input__remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-input:hover .image-input__remove {
  opacity: 1;
}

.image-input__remove:hover {
  background-color: rgba(245, 108, 108, 0.9);
}
</style>
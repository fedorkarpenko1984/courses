<template>
  <a-table
    :columns="coursesTableColumnConfig"
    :data-source="formatedCourses"
    :pagination="false"
    :customRow="handleCustomRow"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'title'">
        <span>
          {{ column.title }}
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">

      <template v-if="column.key === 'name'" >
        <a>
          {{ record.name }}
        </a>
      </template>

      <template v-else-if="column.key === 'controls'">
        <div class="controls" @click.stop>
          <div
            style="color: lightseagreen"
            @click="emit('edit', record.id)"
          >
            <EditFilled />
          </div>
          <div
            style="color: red"
            @click="emit('delete', {
              id: record.id,
              title: record.title
            })"
          >
            <DeleteOutlined />
          </div>
        </div>
      </template>

      <template v-else-if="column.key === 'status'">
        <span>
          <a-tag
            :color="statusColorsForCoursesTable[record.status as TCourseStatus]"
          >
            {{ record.status.toUpperCase() }}
          </a-tag>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import type { TCourseStatus, ICourse } from '@repo/types';
import {
  coursesTableColumnConfig,
  statusColorsForCoursesTable,
} from '@/constants';
import {
  DeleteOutlined,
  EditFilled
} from '@ant-design/icons-vue';
import { computed } from 'vue';
import { formatDate } from '@/utils'

const props = defineProps<{
  courses: ICourse[]
}>()

const emit = defineEmits<{
  (e: 'delete', payload: Pick<ICourse, 'id' | 'title'>): void
  (e: 'edit', payload: number): void
}>()

interface ICourseInTable {
  id: number,
  title: string,
  author: string,
  status: TCourseStatus,
  createdAt: string,
}

const handleCustomRow = (record: ICourseInTable) => {
  return {
    onClick: () => {
      console.log('Переход на страницу конкурса ', record)
    },
  }
}

const formatedCourses = computed<ICourseInTable[]>(() => {
  return props.courses.map(({ id, title, author, status, createdAt }) => ({
    id, title, author, status,
    createdAt: formatDate(createdAt!)
  }))
})

</script>

<style scoped lang="scss">
.controls {
  display: flex;
  gap: 12px;
  & > * {
    cursor: pointer;
  }
}
</style>
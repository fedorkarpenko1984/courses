<template>
  <div style="width: 200px;">
    <a-menu
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      theme="dark"
      :items="items"
      @click="menuClickHandler"
    ></a-menu>
  </div>
</template>

<script setup lang="ts">
import { reactive, h, ref } from 'vue';
import {
  HomeOutlined,
  BookOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter()
const route = useRoute()

const selectedKeys = ref<string[]>([]);

const items = reactive([
  {
    key: 'home',
    icon: () => h(HomeOutlined),
    label: 'Главная',
  },
  {
    key: 'courses',
    icon: () => h(BookOutlined),
    label: 'Курсы',
  },
  {
    key: 'users',
    icon: () => h(UserOutlined),
    label: 'Пользователи',
  },
]);

items.forEach(item => {
  if (route.path.startsWith(`/${item.key}`)) {
    selectedKeys.value.push(item.key)
  }
})
if (route.path === '/') selectedKeys.value.push('home')

const menuClickHandler = (event: { key: string }) => {
  router.push({ name: event.key });
}
</script>

<style>
.ant-menu {
  height: calc(100vh - 48px);
}
</style>
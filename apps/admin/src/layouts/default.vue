<template>
  <div class="default-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
    >
      <SidebarNavigation />
    </a-layout-sider>
    <slot />
    <div class="default-layout__notifications">
      <a-alert
        v-for="notification, index in notifications"
        :key="index"
        :message="notification.message"
        :type="notification.type"
        show-icon
        closable
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SidebarNavigation from '@/components/layouts/SidebarNavigation.vue';
import { useNotificationsStore } from '@/stores/notificationsStore';

const collapsed = ref<boolean>(false)

const { notifications } = useNotificationsStore()

</script>

<style lang="scss">
.default-layout {
  display: flex;
  align-items: center;

  &__notifications {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
  }
}
.ant-layout-sider-trigger {
    height: 48px;
    color: #fff;
    line-height: 48px;
    text-align: center;
    background: #002140;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
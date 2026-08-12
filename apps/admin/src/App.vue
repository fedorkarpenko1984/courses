<template>
  <div>
    <component :is="currentLayout">
      <Suspense>
        <RouterView />
      </Suspense>
    </component>
  </div>
</template>

<script setup lang="ts">
import { watch, shallowRef, type Component } from 'vue';
import { layouts, type LayoutType } from '@/layouts';
import { useRoute } from 'vue-router';

const route = useRoute()

const currentLayout = shallowRef<Component>(layouts.default)

watch(route, (newRoute) => {
  const layoutName: LayoutType = newRoute.meta?.layout || 'default'
  currentLayout.value = layouts[layoutName]
})

</script>

<style lang="scss" scoped>

</style>
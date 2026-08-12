import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/home.vue'
import type { LayoutType } from '@/layouts'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: LayoutType
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login.vue'),
      meta: {
        layout: 'empty'
      }
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('@/pages/courses/index.vue'),
    },
    {
      path: '/courses/:id',
      name: 'courses-edit',
      component: () => import('@/pages/courses/edit.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/pages/users.vue'),
    },
  ],
})

export default router

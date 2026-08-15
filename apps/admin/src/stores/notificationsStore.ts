import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { type TNotification } from '@/types/notifications'

export const useNotificationsStore = defineStore('notification', () => {
  const notifications = ref<TNotification[]>([])

  const addNotification = (notification: TNotification) => {
    const id = Date.now().toString() + Math.random()
    notifications.value.push({
        ...notification,
        id
    })
    setTimeout(() => {
      const index = notifications.value.findIndex(n => n.id === id)
      if (index !== -1) {
      notifications.value.splice(index, 1)
      }
    }, 5000)
  }
  return {
    notifications,
    addNotification,
  }
})
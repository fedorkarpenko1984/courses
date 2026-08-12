import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { COURSES_APP_LOGIN, COURSES_APP_ROLE, COURSES_APP_TOKEN } from '@/constants'


export const useAuthStore = defineStore('auth', () => {
  // Состояние
  const token = ref<string | null>(null)
  const login = ref<string | null>(null)
  const role = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function checkAuth(): Promise<boolean> {
    if (!token.value) {
      return false
    }

    try {
      const response = await fetch('http://localhost:3333/admin/me', {
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        clearAuth()
        return false
      }

      const data = await response.json()
      
      login.value = data.login
      role.value = data.role
      
      return true
    } catch (error) {
      clearAuth()
      return false
    }
  }

  function setAuth(data: { token: string; login: string; role: string }) {
    token.value = data.token
    login.value = data.login
    role.value = data.role
    localStorage.setItem(COURSES_APP_TOKEN, data.token)
    localStorage.setItem(COURSES_APP_LOGIN, data.login)
    localStorage.setItem(COURSES_APP_ROLE, data.role)
  }

  function clearAuth() {
    token.value = null
    login.value = null
    role.value = null
    localStorage.removeItem(COURSES_APP_TOKEN)
    localStorage.removeItem(COURSES_APP_LOGIN)
    localStorage.removeItem(COURSES_APP_ROLE)
  }

  // Восстановление сессии с проверкой токена
  async function restoreSession(): Promise<boolean> {
    const savedToken = localStorage.getItem(COURSES_APP_TOKEN)
    const savedLogin = localStorage.getItem(COURSES_APP_LOGIN)
    const savedRole = localStorage.getItem(COURSES_APP_ROLE)

    if (!savedToken || !savedLogin || !savedRole) {
      return false
    }

    // Восстанавливаем данные из localStorage
    token.value = savedToken
    login.value = savedLogin
    role.value = savedRole

    // Проверяем валидность токена
    const isValid = await checkAuth()
    
    if (!isValid) {
      clearAuth()
      return false
    }

    return true
  }
  return {
    token,
    login,
    role,
    isAuthenticated,
    setAuth,
    restoreSession,
  }
})
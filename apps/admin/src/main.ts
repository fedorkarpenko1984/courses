import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

const authStore = useAuthStore()

authStore.restoreSession().then((isValid) => {
  if (!isValid && router.currentRoute.value.path !== '/login') {
    router.push('/login')
  }
  
  app.mount('#app')
})

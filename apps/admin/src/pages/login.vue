<template>
  <div class="login-page">
     <form class="login-form">
        <a-input
          v-model:value="loginModel"
          placeholder="Логин"
        />
        <a-input-password
          v-model:value="passwordModel"
          placeholder="Пароль"
        />
        <a-button
          type="primary"
          :loading="pending"
          @click="getAuth"
        >
          Войти
        </a-button>
     </form>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { $fetch } from '@/helpers/myFetch';

console.log($fetch);

const router = useRouter()
const { setAuth } = useAuthStore()

const loginModel = shallowRef<string>('admin')
const passwordModel = shallowRef<string>('password')

const pending = shallowRef<boolean>(false)

const getAuth = async () => {
  pending.value = true;

  try {
    const response = await fetch('http://localhost:3333/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: loginModel.value,
        password: passwordModel.value
      })
    })
    if (response.ok) {
      const { login, role, token } = await response.json();
      setAuth({ token, login, role });

      router.push('/')
    }
  } catch (error) {
    console.error('Не судьба!')
  }

  pending.value = false;
}    

</script>

<style lang="scss" scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-form {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 20px;
  }
}
</style>
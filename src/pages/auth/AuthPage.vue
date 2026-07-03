<script setup lang="ts">
import { AUTH_ROUTE } from '@/shared/router';
import { useAuthStore } from '@/shared/store/auth.store';
import { ElCard, ElForm, ElFormItem, ElInput, FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import DeviceConnectionDialog from './DeviceConnectionDialog.vue';

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  login: '',
  password: '',
})

const formRef = ref<FormInstance>()
const deviceConnectionDialogVisible = ref(false)

function submitForm() {
    if (!formRef.value)
        return false
    authStore.login(form)
}

function goToRegister() {
    router.push({ name: AUTH_ROUTE.REGISTER.NAME })
}

function goToResetPassword() {
    router.push({ name: AUTH_ROUTE.RESET_PASSWORD.NAME })
}

function handleDeviceConnected(syncCompleted: boolean) {
  authStore.setAuthenticated(false)
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')

  ElNotification({
    title: 'Устройство подключено',
    message: syncCompleted
      ? 'Войдите в аккаунт с прежним паролем.'
      : 'Аккаунт восстановлен. Войдите в аккаунт и повторите синхронизацию.',
    type: syncCompleted ? 'success' : 'warning',
  })
}
</script>

<template>
    <div class="auth-page flex w-full h-screen items-center justify-center bg-blue-300">
        <ElCard
            body-class="auth-card__body flex flex-col gap-8 p-8"
            class="auth-card rounded-2xl"
        >
            <h1 class="auth-title text-[57px] leading-none text-purple">
                Добро пожаловать
            </h1>
            <ElForm
                ref="formRef"
                class="flex flex-col gap-5"
                label-position="top"
                :model="form"
            >
                <ElFormItem
                    label="Имя пользователя"
                    prop="login"
                >
                    <ElInput v-model="form.login" />
                </ElFormItem>
                <ElFormItem
                    label="Пароль"
                    prop="password"
                >
                    <ElInput
                        v-model="form.password"
                        show-password
                        type="password"
                    />
                </ElFormItem>
            </ElForm>
            <ElButton
                type="primary"
                @click="submitForm"
            >
                Вход
            </ElButton>
            <div class="flex justify-between gap-3">
                <ElButton
                    link
                    type="primary"
                    @click="goToRegister"
                >
                    Регистрация
                </ElButton>
                <ElButton
                    link
                    type="primary"
                    @click="goToResetPassword"
                >
                    Забыли пароль?
                </ElButton>
            </div>
            <ElButton link type="primary" @click="deviceConnectionDialogVisible = true">
                Подключить новое устройство
            </ElButton>
        </ElCard>
        <DeviceConnectionDialog
            v-model="deviceConnectionDialogVisible"
            @completed="handleDeviceConnected"
        />
    </div>
</template>

<style scoped>
.auth-card {
  width: min(560px, calc(100vw - 32px));
}

.auth-title {
  overflow-wrap: anywhere;
}

@media (max-width: 520px) {
  .auth-page {
    align-items: flex-start;
    height: 100dvh;
    padding: max(18px, env(safe-area-inset-top)) 10px max(18px, env(safe-area-inset-bottom));
    overflow-y: auto;
  }

  .auth-card {
    width: 100%;
    border-radius: 12px;
  }

  :deep(.auth-card__body) {
    gap: 20px;
    padding: 22px 16px;
  }

  .auth-title {
    font-size: 34px;
    line-height: 1.05;
  }
}
</style>

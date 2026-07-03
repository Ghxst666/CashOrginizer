<script setup lang="ts">
import { AuthEntityService } from '@/entities/auth';
import { AUTH_ROUTE } from '@/shared/router';
import { ElCard, ElForm, ElFormItem, ElInput, ElNotification, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const form = reactive({
  code: '',
  new_password: '',
})

const formRef = ref<FormInstance>()
const isSubmitting = ref(false)

const rules: FormRules<typeof form> = {
  code: [
    {
      required: true,
      message: 'Введите code',
      trigger: 'blur',
    },
  ],
  new_password: [
    {
      required: true,
      message: 'Введите новый пароль',
      trigger: 'blur',
    },
    {
      min: 8,
      message: 'Пароль должен быть минимум 8 символов',
      trigger: 'blur',
    },
  ],
}

async function submitForm() {
  if (!formRef.value)
    return

  const isValid = await formRef.value.validate().catch(() => false)
  if (!isValid)
    return

  try {
    isSubmitting.value = true
    await AuthEntityService.resetPassword(form)
    ElNotification({
      title: 'Пароль',
      message: 'Пароль успешно изменен',
      type: 'success',
    })
    router.push({ name: AUTH_ROUTE.LOGIN.NAME })
  }
  finally {
    isSubmitting.value = false
  }
}

function goToLogin() {
  router.push({ name: AUTH_ROUTE.LOGIN.NAME })
}
</script>

<template>
  <div class="auth-page flex w-full h-screen items-center justify-center bg-blue-300">
    <ElCard
      body-class="auth-card__body flex flex-col gap-8 p-8"
      class="auth-card rounded-2xl"
    >
      <h1 class="auth-title text-[57px] leading-none text-purple">
        Сброс пароля
      </h1>
      <ElForm
        ref="formRef"
        class="flex flex-col gap-5"
        label-position="top"
        :model="form"
        :rules="rules"
      >
        <ElFormItem
          label="Code"
          prop="code"
        >
          <ElInput v-model="form.code" />
        </ElFormItem>
        <ElFormItem
          label="Новый пароль"
          prop="new_password"
        >
          <ElInput
            v-model="form.new_password"
            show-password
            type="password"
          />
        </ElFormItem>
      </ElForm>
      <div class="flex flex-col gap-1">
        <ElButton
          type="primary"
          :loading="isSubmitting"
          @click="submitForm"
        >
          Изменить пароль
        </ElButton>
        <ElButton
          class="!ml-0"
          @click="goToLogin"
        >
          Назад
        </ElButton>
      </div>
    </ElCard>
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

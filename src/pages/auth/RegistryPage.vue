<script setup lang="ts">
import { AuthEntityService } from '@/entities/auth';
import { AUTH_ROUTE } from '@/shared/router';
import { ElCard, ElForm, ElFormItem, ElInput, ElNotification, FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const form = reactive({
  nickname: '',
  email: '',
  password: '',
})

const formRef = ref<FormInstance>()
const recoveryDialogVisible = ref(false)
const recoveryCodes = ref<string[]>([])
const isSubmitting = ref(false)

const rules: FormRules<typeof form> = {
  nickname: [
    {
      required: true,
      message: 'Введите имя',
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: 'Введите email',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: 'Введите корректный email',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: 'Введите пароль',
      trigger: 'blur',
    },
    {
      min: 8,
      message: 'Пароль должен быть минимум 8 символов',
      trigger: 'blur',
    },
  ],
}

const recoveryCodesText = computed(() => recoveryCodes.value.join('\n'))

async function submitForm() {
  if (!formRef.value)
    return

  const isValid = await formRef.value.validate().catch(() => false)
  if (!isValid)
    return

  try {
    isSubmitting.value = true
    const response = await AuthEntityService.register(form)

    recoveryCodes.value = response.data.recovery_codes
    recoveryDialogVisible.value = true
    ElNotification({
      title: 'Регистрация',
      message: 'Регистрация прошла успешно',
      type: 'success',
    })
    router.push({ name: AUTH_ROUTE.LOGIN.NAME })
  }
  finally {
    isSubmitting.value = false
  }
}

async function copyRecoveryCodes() {
  await navigator.clipboard.writeText(recoveryCodesText.value)
  ElNotification({
    title: 'Коды восстановления',
    message: 'Коды скопированы',
    type: 'success',
  })
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
        Регистрация
      </h1>
      <ElForm
        ref="formRef"
        class="flex flex-col gap-5"
        label-position="top"
        :model="form"
        :rules="rules"
      >
        <ElFormItem
          label="Имя"
          prop="name"
        >
          <ElInput v-model="form.nickname" />
        </ElFormItem>
        <ElFormItem
          label="Email"
          prop="email"
        >
          <ElInput
            v-model="form.email"
            type="email"
          />
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
        :loading="isSubmitting"
        @click="submitForm"
      >
        Зарегистрироваться
      </ElButton>
      <ElButton
        link
        type="primary"
        @click="goToLogin"
      >
        Уже есть аккаунт
      </ElButton>
    </ElCard>

    <ElDialog
      v-model="recoveryDialogVisible"
      title="Коды восстановления"
      width="520px"
      :close-on-click-modal="false"
    >
      <ElInput
        :model-value="recoveryCodesText"
        type="textarea"
        :rows="8"
        readonly
      />
      <template #footer>
        <ElButton
          type="primary"
          @click="copyRecoveryCodes"
        >
          Copy
        </ElButton>
      </template>
    </ElDialog>
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

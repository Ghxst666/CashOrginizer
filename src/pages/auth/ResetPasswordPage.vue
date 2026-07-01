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
  <div class="flex w-full h-screen items-center justify-center bg-blue-300">
    <ElCard
      body-class="flex flex-col gap-8 p-8"
      class="rounded-2xl"
    >
      <h1 class="text-[57px] leading-none text-purple">
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

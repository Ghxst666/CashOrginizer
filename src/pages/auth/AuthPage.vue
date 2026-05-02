<script setup lang="ts">
import { useAuthStore } from '@/shared/store/auth.store';
import { ElCard, ElForm, ElFormItem, ElInput, FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

const authStore = useAuthStore()

const form = reactive({
  login: '',
  password: '',
})

const formRef = ref<FormInstance>()

function submitForm() {
    if (!formRef.value)
        return false
    authStore.login(form)
}
</script>

<template>
    <div
        class="flex w-full h-screen items-center justify-center bg-blue-300"
    >
        <ElCard
            body-class="flex flex-col gap-8 p-8"
            class="rounded-2xl"
        >
            <h1 class="text-[57px] leading-none text-purple">
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
                    <ElInput
                        v-model="form.login"
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
                @click="submitForm"
            >
                Вход
            </ElButton>
        </ElCard>
    </div>
</template>
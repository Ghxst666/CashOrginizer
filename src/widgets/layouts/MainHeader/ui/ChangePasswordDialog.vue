<script setup lang="ts">
import { AuthEntityService } from '@/entities/auth';
import { ElNotification, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

const visible = defineModel<boolean>({ required: true })

const formRef = ref<FormInstance>()
const isSubmitting = ref(false)

const form = reactive({
    code: '',
    new_password: '',
})

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

async function submit() {
    if (!formRef.value)
        return

    const isValid = await formRef.value.validate().catch(() => false)
    if (!isValid)
        return

    try {
        isSubmitting.value = true
        await AuthEntityService.resetPassword(form)
        visible.value = false
        ElNotification({
            title: 'Пароль',
            message: 'Пароль успешно изменен',
            type: 'success',
        })
    }
    finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <ElDialog
        v-model="visible"
        title="Изменить пароль"
        width="520px"
    >
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
        <template #footer>
            <ElButton @click="visible = false">
                Отмена
            </ElButton>
            <ElButton
                type="primary"
                :loading="isSubmitting"
                @click="submit"
            >
                Изменить пароль
            </ElButton>
        </template>
    </ElDialog>
</template>

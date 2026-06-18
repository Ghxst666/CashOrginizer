<script setup lang="ts">
import { BackupsService } from '@/entities/backups';
import { ElNotification, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

const visible = defineModel<boolean>({ required: true })

const formRef = ref<FormInstance>()
const isSubmitting = ref(false)

const form = reactive({
    current_password: '',
})

const rules: FormRules<typeof form> = {
    current_password: [
        {
            required: true,
            message: 'Введите пароль',
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
        await BackupsService.clearDatabase({
            current_password: form.current_password,
            dry_run: false,
            confirm: true,
        })
        visible.value = false
        form.current_password = ''
        ElNotification({
            title: 'База данных',
            message: 'База данных успешно очищена',
            type: 'success',
        })
    }
    catch {
        ElNotification({
            title: 'База данных',
            message: 'Не получилось очистить базу данных',
            type: 'error',
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
        title="Очистить базу данных"
        width="520px"
    >
        <ElForm
            ref="formRef"
            label-position="top"
            :model="form"
            :rules="rules"
        >
            <ElFormItem
                label="Пароль"
                prop="password"
            >
                <ElInput
                    v-model="form.current_password"
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
                type="danger"
                :loading="isSubmitting"
                @click="submit"
            >
                Очистить
            </ElButton>
        </template>
    </ElDialog>
</template>

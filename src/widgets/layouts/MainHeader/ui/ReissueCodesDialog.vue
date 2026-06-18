<script setup lang="ts">
import { AuthEntityService } from '@/entities/auth';
import { ElNotification, FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref } from 'vue';

const visible = defineModel<boolean>({ required: true })

const formRef = ref<FormInstance>()
const recoveryCodesDialogVisible = ref(false)
const recoveryCodes = ref<string[]>([])
const isSubmitting = ref(false)

const form = reactive({
    current_password: '',
})

const rules: FormRules<typeof form> = {
    current_password: [
        {
            required: true,
            message: 'Введите текущий пароль',
            trigger: 'blur',
        },
    ],
}

const recoveryCodesText = computed(() => recoveryCodes.value.join('\n'))

async function submit() {
    if (!formRef.value)
        return

    const isValid = await formRef.value.validate().catch(() => false)
    if (!isValid)
        return

    try {
        isSubmitting.value = true
        const response = await AuthEntityService.reissueRecoveryCodes(form)

        recoveryCodes.value = response.data.recovery_codes
        visible.value = false
        recoveryCodesDialogVisible.value = true
        ElNotification({
            title: 'Коды восстановления',
            message: 'Коды успешно сброшены',
            type: 'success',
        })
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
</script>

<template>
    <ElDialog
        v-model="visible"
        title="Сбросить коды"
        width="520px"
    >
        <ElForm
            ref="formRef"
            label-position="top"
            :model="form"
            :rules="rules"
        >
            <ElFormItem
                label="Текущий пароль"
                prop="current_password"
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
                type="primary"
                :loading="isSubmitting"
                @click="submit"
            >
                Сбросить коды
            </ElButton>
        </template>
    </ElDialog>

    <ElDialog
        v-model="recoveryCodesDialogVisible"
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
</template>

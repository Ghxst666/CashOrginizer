<script setup lang="ts">
import { BackupsService, BackupResponse } from '@/entities/backups';
import { Download, Refresh } from '@element-plus/icons-vue';
import { ElNotification, FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref } from 'vue';

const visible = ref(false)
const passwordDialogVisible = ref(false)
const backups = ref<BackupResponse[]>([])
const isLoading = ref(false)
const restoringBackupId = ref<number | string | null>(null)
const downloadingBackupId = ref<number | string | null>(null)
const pendingAction = ref<'restore' | 'download' | null>(null)
const selectedBackup = ref<BackupResponse | null>(null)
const passwordFormRef = ref<FormInstance>()

const passwordForm = reactive({
    current_password: '',
})

const passwordRules: FormRules<typeof passwordForm> = {
    current_password: [
        {
            required: true,
            message: 'Введите текущий пароль',
            trigger: 'blur',
        },
    ],
}

const passwordDialogTitle = computed(() => {
    if (pendingAction.value === 'restore')
        return 'Восстановить резервную копию'

    return 'Скачать резервную копию'
})

defineExpose({
    open,
})

async function open() {
    visible.value = true
    await loadBackups()
}

function getBackupId(backup: BackupResponse): number | string {
    return backup.id ?? backup.backup_id ?? backup.filename ?? backup.name ?? ''
}

function getBackupTitle(backup: BackupResponse): string {
    return backup.filename || backup.name || `Backup ${getBackupId(backup)}`
}

function getBackupSize(backup: BackupResponse): string {
    if (!backup.size)
        return '-'

    return String(backup.size)
}

async function loadBackups() {
    try {
        isLoading.value = true
        const response = await BackupsService.getBackups()
        backups.value = response.data
    }
    catch {
        ElNotification({
            title: 'Резервные копии',
            message: 'Не получилось загрузить резервные копии',
            type: 'error',
        })
    }
    finally {
        isLoading.value = false
    }
}

function openPasswordDialog(backup: BackupResponse, action: 'restore' | 'download') {
    selectedBackup.value = backup
    pendingAction.value = action
    passwordForm.current_password = ''
    passwordDialogVisible.value = true
}

async function submitPasswordAction() {
    if (!passwordFormRef.value || !selectedBackup.value || !pendingAction.value)
        return

    const isValid = await passwordFormRef.value.validate().catch(() => false)
    if (!isValid)
        return

    if (pendingAction.value === 'restore') {
        await restoreBackup(selectedBackup.value, passwordForm.current_password)
    }
    else {
        await downloadBackup(selectedBackup.value, passwordForm.current_password)
    }
}

async function restoreBackup(backup: BackupResponse, currentPassword: string) {
    const backupId = getBackupId(backup)

    try {
        restoringBackupId.value = backupId
        await BackupsService.restoreBackup({
            backup_id: backupId,
            current_password: currentPassword,
            dry_run: false,
            confirm: true,
            mode: 'replace',
        })
        passwordDialogVisible.value = false
        ElNotification({
            title: 'Восстановление',
            message: 'База данных успешно восстановлена',
            type: 'success',
        })
    }
    catch {
        ElNotification({
            title: 'Восстановление',
            message: 'Не получилось восстановить базу данных',
            type: 'error',
        })
    }
    finally {
        restoringBackupId.value = null
    }
}

async function downloadBackup(backup: BackupResponse, currentPassword: string) {
    const backupId = getBackupId(backup)

    try {
        downloadingBackupId.value = backupId
        const response = await BackupsService.downloadBackup({
            backup_id: backupId,
            current_password: currentPassword,
        })
        const url = URL.createObjectURL(response.data as unknown as Blob)
        const link = document.createElement('a')

        link.href = url
        link.download = getBackupTitle(backup)
        link.click()
        URL.revokeObjectURL(url)
        passwordDialogVisible.value = false
    }
    catch {
        ElNotification({
            title: 'Скачивание',
            message: 'Не получилось скачать резервную копию',
            type: 'error',
        })
    }
    finally {
        downloadingBackupId.value = null
    }
}
</script>

<template>
    <ElDialog
        v-model="visible"
        title="Резервные копии"
        width="760px"
    >
        <ElTable
            v-loading="isLoading"
            :data="backups"
            height="360"
        >
            <ElTableColumn
                label="ID"
                width="90"
            >
                <template #default="{ row }">
                    {{ getBackupId(row) }}
                </template>
            </ElTableColumn>
            <ElTableColumn label="Название">
                <template #default="{ row }">
                    {{ getBackupTitle(row) }}
                </template>
            </ElTableColumn>
            <ElTableColumn
                prop="created_at"
                label="Создано"
                width="180"
            />
            <ElTableColumn
                label="Размер"
                width="120"
            >
                <template #default="{ row }">
                    {{ getBackupSize(row) }}
                </template>
            </ElTableColumn>
            <ElTableColumn
                label=""
                width="120"
                fixed="right"
            >
                <template #default="{ row }">
                    <div class="flex gap-2 justify-end">
                        <ElTooltip content="Восстановить">
                            <ElButton
                                circle
                                :icon="Refresh"
                                :loading="restoringBackupId === getBackupId(row)"
                                @click.stop="openPasswordDialog(row, 'restore')"
                            />
                        </ElTooltip>
                        <ElTooltip content="Скачать">
                            <ElButton
                                circle
                                :icon="Download"
                                :loading="downloadingBackupId === getBackupId(row)"
                                @click.stop="openPasswordDialog(row, 'download')"
                            />
                        </ElTooltip>
                    </div>
                </template>
            </ElTableColumn>
        </ElTable>
        <template #footer>
            <ElButton @click="loadBackups">
                Обновить
            </ElButton>
            <ElButton @click="visible = false">
                Закрыть
            </ElButton>
        </template>
    </ElDialog>

    <ElDialog
        v-model="passwordDialogVisible"
        :title="passwordDialogTitle"
        width="520px"
    >
        <ElForm
            ref="passwordFormRef"
            label-position="top"
            :model="passwordForm"
            :rules="passwordRules"
        >
            <ElFormItem
                label="Текущий пароль"
                prop="current_password"
            >
                <ElInput
                    v-model="passwordForm.current_password"
                    show-password
                    type="password"
                />
            </ElFormItem>
        </ElForm>
        <template #footer>
            <ElButton @click="passwordDialogVisible = false">
                Отмена
            </ElButton>
            <ElButton
                type="primary"
                :loading="restoringBackupId !== null || downloadingBackupId !== null"
                @click="submitPasswordAction"
            >
                Продолжить
            </ElButton>
        </template>
    </ElDialog>
</template>

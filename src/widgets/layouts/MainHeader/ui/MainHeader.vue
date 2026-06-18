<script setup lang="ts">
import { BackupsService } from '@/entities/backups';
import type { SyncConflictResolution } from '@/entities/sync';
import { useImportPaymentsFromCsv } from '@/entities/transaction/payments';
import { useHeaderSearchStore } from '@/shared/store/header-search.store';
import { useSyncStore } from '@/shared/store/sync.store';
import { useQueryClient } from '@tanstack/vue-query';
import { ArrowDown, Menu, Refresh, Search, Warning } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { computed, ref, watch } from 'vue';
import BackupsDialog from './BackupsDialog.vue';
import ChangePasswordDialog from './ChangePasswordDialog.vue';
import ClearDatabaseDialog from './ClearDatabaseDialog.vue';
import ExportQifDialog from './ExportQifDialog.vue';
import ReissueCodesDialog from './ReissueCodesDialog.vue';

const qifFileInput = ref<HTMLInputElement>()
const backupsDialogRef = ref<InstanceType<typeof BackupsDialog>>()

const changePasswordDialogVisible = ref(false)
const reissueCodesDialogVisible = ref(false)
const exportQifDialogVisible = ref(false)
const clearDatabaseDialogVisible = ref(false)
const isCreatingBackup = ref(false)
const conflictsDialogVisible = ref(false)
const selectedConflictResolutions = ref<Record<string, SyncConflictResolution>>({})

const importPaymentsFromCsv = useImportPaymentsFromCsv()
const headerSearchStore = useHeaderSearchStore()
const syncStore = useSyncStore()
const queryClient = useQueryClient()

type SyncTagType = 'success' | 'warning' | 'info' | 'danger'

const syncStatusText = computed(() => {
    if (syncStore.isSyncing)
        return 'Синхронизация...'

    if (syncStore.errorMessage)
        return syncStore.errorMessage

    if (!syncStore.status)
        return 'Проверка синхронизации'

    if (!syncStore.isCloudConfigured)
        return 'Облачная синхронизация не настроена'

    if (syncStore.unresolvedConflictsCount > 0)
        return 'Есть конфликты синхронизации'

    if (syncStore.failedCount > 0)
        return 'Не удалось отправить часть изменений'

    if (syncStore.pendingCount > 0)
        return `Ожидает синхронизации: ${syncStore.pendingCount}`

    return 'Синхронизировано'
})

const syncStatusType = computed<SyncTagType>(() => {
    if (!syncStore.status || syncStore.isSyncing)
        return 'info'

    if (!syncStore.isCloudConfigured)
        return 'warning'

    if (syncStore.unresolvedConflictsCount > 0 || syncStore.failedCount > 0 || syncStore.errorMessage)
        return 'danger'

    if (syncStore.pendingCount > 0)
        return 'warning'

    return 'success'
})

const canRunSync = computed(() => Boolean(syncStore.status && syncStore.isCloudConfigured && !syncStore.isSyncing))

watch(
    () => syncStore.lastCompletedAt,
    async (value) => {
        if (value) {
            await queryClient.invalidateQueries()
        }
    },
)

function handleMainMenuCommand(command: string) {
    if (command === 'restore') {
        backupsDialogRef.value?.open()
    }

    if (command === 'importQif') {
        qifFileInput.value?.click()
    }

    if (command === 'exportQif') {
        exportQifDialogVisible.value = true
    }

    if (command === 'createBackup') {
        createBackup()
    }

    if (command === 'clearDatabase') {
        clearDatabaseDialogVisible.value = true
    }
}

function handleHeaderCommand(command: string) {
    if (command === 'changePassword') {
        changePasswordDialogVisible.value = true
    }

    if (command === 'reissueCodes') {
        reissueCodesDialogVisible.value = true
    }
}

function onQifFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (file) {
        importPaymentsFromCsv.mutate({ file })
    }

    input.value = ''
}

async function createBackup() {
    try {
        isCreatingBackup.value = true
        await BackupsService.createBackup()
        ElNotification({
            title: 'Резервная копия',
            message: 'Резервная копия успешно создана',
            type: 'success',
        })
    }
    catch {
        ElNotification({
            title: 'Резервная копия',
            message: 'Не получилось создать резервную копию',
            type: 'error',
        })
    }
    finally {
        isCreatingBackup.value = false
    }
}

async function syncNow() {
    await syncStore.runSync()

    if (syncStore.errorMessage) {
        ElNotification({
            title: 'Синхронизация',
            message: syncStore.errorMessage,
            type: 'error',
        })
        return
    }

    const result = syncStore.lastRunResult

    if (result?.skipped) {
        ElNotification({
            title: 'Синхронизация',
            message: 'Синхронизация пропущена: облако не настроено или выключено',
            type: 'warning',
        })
        return
    }

    if ((result?.push?.failed ?? 0) > 0) {
        ElNotification({
            title: 'Синхронизация',
            message: 'Не удалось отправить часть изменений. Данные сохранены локально.',
            type: 'warning',
        })
        return
    }

    if ((result?.pull?.failed ?? 0) > 0) {
        ElNotification({
            title: 'Синхронизация',
            message: 'Не удалось получить часть изменений с другого устройства.',
            type: 'warning',
        })
        return
    }

    if ((result?.pull?.conflicts ?? 0) > 0 || syncStore.unresolvedConflictsCount > 0) {
        ElNotification({
            title: 'Синхронизация',
            message: 'Есть конфликты синхронизации',
            type: 'warning',
        })
        await openConflictsDialog()
        return
    }

    ElNotification({
        title: 'Синхронизация',
        message: 'Синхронизация завершена',
        type: 'success',
    })
}

async function openConflictsDialog() {
    conflictsDialogVisible.value = true
    await syncStore.loadConflicts()
}

async function resolveConflict(conflictId: number | string) {
    const resolution = selectedConflictResolutions.value[String(conflictId)]

    if (!resolution)
        return

    await syncStore.resolveConflict(conflictId, resolution)
}

function formatConflictValue(value: unknown): string {
    if (value === null || value === undefined)
        return 'Нет данных'

    if (typeof value === 'string')
        return value

    return JSON.stringify(value, null, 2)
}

</script>

<template>
    <div class="flex flex-row items-center justify-between w-full bg-[#009ae0]">
        <input
            ref="qifFileInput"
            class="hidden"
            type="file"
            accept=".qif"
            @change="onQifFileChange"
        >

        <ElDropdown
            trigger="click"
            @command="handleMainMenuCommand"
        >
            <ElButton
                class="!size-10 !px-8"
                link
                :loading="isCreatingBackup"
            >
                <ElIcon size="30px">
                    <Menu />
                </ElIcon>
            </ElButton>
            <template #dropdown>
                <ElDropdownMenu>
                    <ElDropdownItem command="restore">
                        Восстановить
                    </ElDropdownItem>
                    <ElDropdownItem command="importQif">
                        Импорт из QIF
                    </ElDropdownItem>
                    <ElDropdownItem command="exportQif">
                        Экспорт в QIF
                    </ElDropdownItem>
                    <ElDropdownItem command="createBackup">
                        Создать резервную копию
                    </ElDropdownItem>
                    <ElDropdownItem command="clearDatabase">
                        Очистить базу данных
                    </ElDropdownItem>
                </ElDropdownMenu>
            </template>
        </ElDropdown>

        <div class="flex flex-row items-center">
            <div class="flex items-center gap-2 px-3 py-2">
                <ElTooltip
                    placement="bottom"
                    :content="syncStatusText"
                >
                    <ElTag
                        :type="syncStatusType"
                        effect="dark"
                    >
                        {{ syncStatusText }}
                    </ElTag>
                </ElTooltip>

                <ElTooltip
                    placement="bottom"
                    content="Синхронизировать сейчас"
                >
                    <ElButton
                        circle
                        :disabled="!canRunSync"
                        :loading="syncStore.isSyncing"
                        @click="syncNow"
                    >
                        <ElIcon>
                            <Refresh />
                        </ElIcon>
                    </ElButton>
                </ElTooltip>

                <ElTooltip
                    v-if="syncStore.unresolvedConflictsCount > 0"
                    placement="bottom"
                    content="Открыть конфликты синхронизации"
                >
                    <ElButton
                        circle
                        type="danger"
                        @click="openConflictsDialog"
                    >
                        <ElIcon>
                            <Warning />
                        </ElIcon>
                    </ElButton>
                </ElTooltip>
            </div>
            <div class="max-w-60 w-full flex items-center px-3 py-2">
                <ElInput
                    v-model="headerSearchStore.query"
                    clearable
                    placeholder="Найти"
                >
                    <template #prefix>
                        <ElIcon>
                            <Search />
                        </ElIcon>
                    </template>
                </ElInput>
            </div>
            <div class="max-w-60 w-full flex items-center px-3 py-2 border-l-[#831919] border-1">
                <ElDropdown
                    class="w-full"
                    trigger="click"
                    @command="handleHeaderCommand"
                >
                    <ElButton class="w-full">
                        Моя база данных
                        <ElIcon class="ml-2">
                            <ArrowDown />
                        </ElIcon>
                    </ElButton>
                    <template #dropdown>
                        <ElDropdownMenu>
                            <ElDropdownItem command="changePassword">
                                Изменить пароль
                            </ElDropdownItem>
                            <ElDropdownItem command="reissueCodes">
                                Сбросить коды
                            </ElDropdownItem>
                        </ElDropdownMenu>
                    </template>
                </ElDropdown>
            </div>
        </div>

        <BackupsDialog ref="backupsDialogRef" />
        <ChangePasswordDialog v-model="changePasswordDialogVisible" />
        <ReissueCodesDialog v-model="reissueCodesDialogVisible" />
        <ExportQifDialog v-model="exportQifDialogVisible" />
        <ClearDatabaseDialog v-model="clearDatabaseDialogVisible" />

        <ElDialog
            v-model="conflictsDialogVisible"
            title="Конфликты синхронизации"
            width="720px"
        >
            <div
                v-if="syncStore.isLoadingConflicts"
                class="py-8 text-center"
            >
                Загрузка конфликтов...
            </div>
            <div
                v-else-if="syncStore.conflicts.length === 0"
                class="py-8 text-center"
            >
                Конфликтов нет
            </div>
            <div
                v-else
                class="flex max-h-[60vh] flex-col gap-4 overflow-auto"
            >
                <div
                    v-for="conflict in syncStore.conflicts"
                    :key="conflict.id"
                    class="rounded border border-gray-200 p-4"
                >
                    <div class="mb-3 flex items-start justify-between gap-3">
                        <div>
                            <div class="font-semibold">
                                {{ conflict.entity_type || 'Объект' }} #{{ conflict.entity_id || conflict.id }}
                            </div>
                            <div
                                v-if="conflict.message"
                                class="text-sm text-gray-500"
                            >
                                {{ conflict.message }}
                            </div>
                        </div>
                        <ElSegmented
                            v-model="selectedConflictResolutions[String(conflict.id)]"
                            :options="[
                                { label: 'Локальная', value: 'local' },
                                { label: 'Удаленная', value: 'remote' },
                            ]"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <div class="mb-1 text-xs font-semibold uppercase text-gray-500">
                                Локальная версия
                            </div>
                            <pre class="max-h-48 overflow-auto rounded bg-gray-50 p-3 text-xs">{{ formatConflictValue(conflict.local) }}</pre>
                        </div>
                        <div>
                            <div class="mb-1 text-xs font-semibold uppercase text-gray-500">
                                Версия с другого устройства
                            </div>
                            <pre class="max-h-48 overflow-auto rounded bg-gray-50 p-3 text-xs">{{ formatConflictValue(conflict.remote) }}</pre>
                        </div>
                    </div>

                    <div class="mt-3 flex justify-end">
                        <ElButton
                            type="primary"
                            :disabled="!selectedConflictResolutions[String(conflict.id)]"
                            :loading="syncStore.isResolvingConflict"
                            @click="resolveConflict(conflict.id)"
                        >
                            Применить решение
                        </ElButton>
                    </div>
                </div>
            </div>
        </ElDialog>
    </div>
</template>

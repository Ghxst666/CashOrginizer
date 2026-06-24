<script setup lang="ts">
import { BackupsService } from '@/entities/backups'
import type { BackupListItem, BackupRestoreMode, BackupRestoreResponse } from '@/entities/backups'
import { Download, Refresh } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { computed, ref } from 'vue'

const visible = ref(false)
const backups = ref<BackupListItem[]>([])
const isLoading = ref(false)
const isDownloading = ref(false)
const isPreviewingRestore = ref(false)
const isApplyingRestore = ref(false)
const selectedBackup = ref<BackupListItem | null>(null)
const downloadDialogVisible = ref(false)
const restoreDialogVisible = ref(false)
const applyRestoreDialogVisible = ref(false)
const downloadPassword = ref('')
const restorePassword = ref('')
const restoreMode = ref<BackupRestoreMode>('replace')
const restorePreview = ref<BackupRestoreResponse | null>(null)

const selectedFilename = computed(() => selectedBackup.value?.filename ?? '')
const restoreSummaryRows = computed(() => Object.entries(restorePreview.value?.summary ?? {}).map(([table, summary]) => ({
  table,
  ...summary,
})))

defineExpose({ open, refresh: loadBackups })

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
  }

  return fallback
}

async function open() {
  visible.value = true
  await loadBackups()
}

async function loadBackups() {
  try {
    isLoading.value = true
    const response = await BackupsService.getBackups()
    backups.value = response.data
  } catch (error) {
    ElNotification({
      title: 'Резервные копии',
      message: getErrorMessage(error, 'Не получилось загрузить резервные копии'),
      type: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ru-RU')
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`

  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

function openDownloadDialog(backup: BackupListItem) {
  selectedBackup.value = backup
  downloadPassword.value = ''
  downloadDialogVisible.value = true
}

function openRestoreDialog(backup: BackupListItem) {
  selectedBackup.value = backup
  restoreMode.value = 'replace'
  restorePreview.value = null
  restorePassword.value = ''
  restoreDialogVisible.value = true
}

async function downloadBackup() {
  if (!selectedFilename.value || !downloadPassword.value) return

  try {
    isDownloading.value = true
    const response = await BackupsService.downloadBackup(selectedFilename.value, {
      current_password: downloadPassword.value,
    })
    const url = URL.createObjectURL(response.data as unknown as Blob)
    const link = document.createElement('a')
    link.href = url
    link.download = selectedFilename.value
    link.click()
    URL.revokeObjectURL(url)
    downloadDialogVisible.value = false
  } catch (error) {
    ElNotification({ title: 'Скачивание', message: getErrorMessage(error, 'Не получилось скачать резервную копию'), type: 'error' })
  } finally {
    downloadPassword.value = ''
    isDownloading.value = false
  }
}

async function previewRestore() {
  if (!selectedFilename.value) return

  try {
    isPreviewingRestore.value = true
    const response = await BackupsService.restoreBackup(selectedFilename.value, {
      mode: restoreMode.value,
      dry_run: true,
    })
    restorePreview.value = response.data
  } catch (error) {
    ElNotification({ title: 'Восстановление', message: getErrorMessage(error, 'Не удалось проверить резервную копию'), type: 'error' })
  } finally {
    isPreviewingRestore.value = false
  }
}

function openApplyRestoreDialog() {
  restorePassword.value = ''
  applyRestoreDialogVisible.value = true
}

async function applyRestore() {
  if (!selectedFilename.value || !restorePassword.value) return

  try {
    isApplyingRestore.value = true
    await BackupsService.restoreBackup(selectedFilename.value, {
      mode: restoreMode.value,
      dry_run: false,
      confirm: true,
      current_password: restorePassword.value,
    })
    restoreDialogVisible.value = false
    applyRestoreDialogVisible.value = false
    ElNotification({ title: 'Восстановление', message: 'База данных восстановлена. Приложение перезагружается.', type: 'success' })
    window.setTimeout(() => window.location.reload(), 300)
  } catch (error) {
    ElNotification({ title: 'Восстановление', message: getErrorMessage(error, 'Не получилось восстановить базу данных'), type: 'error' })
  } finally {
    restorePassword.value = ''
    isApplyingRestore.value = false
  }
}
</script>

<template>
  <ElDialog v-model="visible" title="Резервные копии" width="860px">
    <ElTable v-loading="isLoading" :data="backups" height="360">
      <ElTableColumn prop="filename" label="Название" min-width="370" />
      <ElTableColumn label="Создано" width="210">
        <template #default="{ row }">{{ formatDate(row.last_modified) }}</template>
      </ElTableColumn>
      <ElTableColumn label="Размер" width="110">
        <template #default="{ row }">{{ formatSize(row.size_bytes) }}</template>
      </ElTableColumn>
      <ElTableColumn width="120" fixed="right">
        <template #default="{ row }">
          <div class="flex justify-end gap-2">
            <ElTooltip content="Восстановить">
              <ElButton circle :icon="Refresh" @click.stop="openRestoreDialog(row)" />
            </ElTooltip>
            <ElTooltip content="Скачать">
              <ElButton circle :icon="Download" @click.stop="openDownloadDialog(row)" />
            </ElTooltip>
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
    <template #footer>
      <ElButton @click="loadBackups">Обновить</ElButton>
      <ElButton @click="visible = false">Закрыть</ElButton>
    </template>
  </ElDialog>

  <ElDialog v-model="downloadDialogVisible" title="Скачать резервную копию" width="520px" @closed="downloadPassword = ''">
    <ElForm label-position="top">
      <ElFormItem label="Текущий пароль" required>
        <ElInput v-model="downloadPassword" type="password" show-password />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="downloadDialogVisible = false">Отмена</ElButton>
      <ElButton type="primary" :loading="isDownloading" :disabled="!downloadPassword" @click="downloadBackup">Скачать</ElButton>
    </template>
  </ElDialog>

  <ElDialog v-model="restoreDialogVisible" title="Восстановление из резервной копии" width="820px">
    <template v-if="!restorePreview">
      <ElAlert
        class="mb-4"
        title="Сначала будет выполнена проверка без изменения данных."
        type="info"
        :closable="false"
      />
      <ElRadioGroup v-model="restoreMode" class="flex flex-col items-start gap-3">
        <ElRadio value="replace">Заменить текущие данные данными из копии</ElRadio>
        <ElRadio value="merge">Добавить только отсутствующие записи из копии</ElRadio>
      </ElRadioGroup>
      <div class="mt-5 flex justify-end gap-2">
        <ElButton @click="restoreDialogVisible = false">Отмена</ElButton>
        <ElButton type="primary" :loading="isPreviewingRestore" @click="previewRestore">Проверить</ElButton>
      </div>
    </template>
    <template v-else>
      <ElAlert
        class="mb-4"
        :title="restoreMode === 'replace' ? 'Все текущие данные из перечисленных таблиц будут заменены.' : 'Существующие записи не будут изменены.'"
        :type="restoreMode === 'replace' ? 'warning' : 'info'"
        :closable="false"
      />
      <ElTable :data="restoreSummaryRows" max-height="360">
        <ElTableColumn prop="table" label="Таблица" min-width="180" />
        <ElTableColumn prop="existing_count" label="Сейчас" width="100" />
        <ElTableColumn prop="backup_count" label="В копии" width="100" />
        <ElTableColumn prop="would_insert" label="Добавится" width="110" />
        <ElTableColumn prop="would_skip" label="Пропустится" width="120" />
        <ElTableColumn prop="would_delete" label="Удалится" width="100" />
      </ElTable>
      <div class="mt-5 flex justify-end gap-2">
        <ElButton @click="restorePreview = null">Изменить режим</ElButton>
        <ElButton type="danger" @click="openApplyRestoreDialog">Восстановить</ElButton>
      </div>
    </template>
  </ElDialog>

  <ElDialog v-model="applyRestoreDialogVisible" title="Подтвердите восстановление" width="520px" @closed="restorePassword = ''">
    <ElAlert
      class="mb-4"
      title="Операция изменит локальную базу данных."
      type="warning"
      :closable="false"
    />
    <ElForm label-position="top">
      <ElFormItem label="Текущий пароль" required>
        <ElInput v-model="restorePassword" type="password" show-password />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="applyRestoreDialogVisible = false">Отмена</ElButton>
      <ElButton type="danger" :loading="isApplyingRestore" :disabled="!restorePassword" @click="applyRestore">Подтвердить</ElButton>
    </template>
  </ElDialog>
</template>

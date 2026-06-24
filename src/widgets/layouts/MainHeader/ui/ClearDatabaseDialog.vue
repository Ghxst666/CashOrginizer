<script setup lang="ts">
import { BackupsService } from '@/entities/backups'
import type { BackupClearResponse } from '@/entities/backups'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { computed, ref } from 'vue'

const visible = defineModel<boolean>({ required: true })
const preview = ref<BackupClearResponse | null>(null)
const isPreviewing = ref(false)
const isApplying = ref(false)
const applyDialogVisible = ref(false)
const currentPassword = ref('')

const summaryRows = computed(() => Object.entries(preview.value?.summary ?? {}).map(([table, summary]) => ({ table, ...summary })))

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
  }

  return fallback
}

function reset() {
  preview.value = null
  currentPassword.value = ''
  applyDialogVisible.value = false
}

async function previewClear() {
  try {
    isPreviewing.value = true
    const response = await BackupsService.clearDatabase({ dry_run: true })
    preview.value = response.data
  } catch (error) {
    ElNotification({ title: 'База данных', message: getErrorMessage(error, 'Не получилось проверить очистку'), type: 'error' })
  } finally {
    isPreviewing.value = false
  }
}

async function applyClear() {
  if (!currentPassword.value) return

  try {
    isApplying.value = true
    await BackupsService.clearDatabase({
      dry_run: false,
      confirm: true,
      current_password: currentPassword.value,
    })
    applyDialogVisible.value = false
    visible.value = false
    ElNotification({ title: 'База данных', message: 'База данных очищена. Приложение перезагружается.', type: 'success' })
    window.setTimeout(() => window.location.reload(), 300)
  } catch (error) {
    ElNotification({ title: 'База данных', message: getErrorMessage(error, 'Не получилось очистить базу данных'), type: 'error' })
  } finally {
    currentPassword.value = ''
    isApplying.value = false
  }
}
</script>

<template>
  <ElDialog v-model="visible" title="Очистить базу данных" width="680px" @closed="reset">
    <template v-if="!preview">
      <ElAlert
        title="Перед очисткой будет выполнена проверка. Данные пока не изменятся."
        type="warning"
        :closable="false"
      />
    </template>
    <template v-else>
      <ElAlert
        class="mb-4"
        title="После подтверждения перечисленные данные будут удалены без возможности отмены."
        type="error"
        :closable="false"
      />
      <ElTable :data="summaryRows" max-height="320">
        <ElTableColumn prop="table" label="Таблица" min-width="260" />
        <ElTableColumn prop="existing_count" label="Будет удалено" width="180" />
      </ElTable>
    </template>
    <template #footer>
      <template v-if="!preview">
        <ElButton @click="visible = false">Отмена</ElButton>
        <ElButton type="danger" :loading="isPreviewing" @click="previewClear">Проверить очистку</ElButton>
      </template>
      <template v-else>
        <ElButton @click="preview = null">Назад</ElButton>
        <ElButton type="danger" @click="applyDialogVisible = true">Очистить</ElButton>
      </template>
    </template>
  </ElDialog>

  <ElDialog v-model="applyDialogVisible" title="Подтвердите очистку" width="520px" @closed="currentPassword = ''">
    <ElForm label-position="top">
      <ElFormItem label="Текущий пароль" required>
        <ElInput v-model="currentPassword" type="password" show-password />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="applyDialogVisible = false">Отмена</ElButton>
      <ElButton type="danger" :loading="isApplying" :disabled="!currentPassword" @click="applyClear">Подтвердить</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { SyncService } from '@/entities/sync'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { computed, reactive, ref } from 'vue'

const visible = defineModel<boolean>({ required: true })
const activeTab = ref<'pairing' | 'recovery'>('pairing')
const isSubmitting = ref(false)
const generatedCode = ref('')
const generatedCodeKind = ref<'pairing' | 'recovery' | null>(null)
const expiresAt = ref('')

const pairingForm = reactive({
  current_password: '',
  device_name: '',
})
const recoveryForm = reactive({
  current_password: '',
})

const codeTitle = computed(() => (
  generatedCodeKind.value === 'pairing' ? 'Одноразовый код подключения' : 'Recovery Kit'
))

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
  }

  return fallback
}

function resetGeneratedCode() {
  generatedCode.value = ''
  generatedCodeKind.value = null
  expiresAt.value = ''
}

function handleClose() {
  pairingForm.current_password = ''
  pairingForm.device_name = ''
  recoveryForm.current_password = ''
  resetGeneratedCode()
}

async function createPairingCode() {
  if (!pairingForm.current_password) return

  try {
    isSubmitting.value = true
    const response = await SyncService.createPairing({
      current_password: pairingForm.current_password,
      device_name: pairingForm.device_name.trim() || undefined,
    })

    generatedCode.value = response.data.pairing_code
    generatedCodeKind.value = 'pairing'
    expiresAt.value = response.data.expires_at
    pairingForm.current_password = ''
  } catch (error) {
    ElNotification({
      title: 'Подключение устройства',
      message: getErrorMessage(error, 'Не удалось создать код подключения'),
      type: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

async function createRecoveryKit() {
  if (!recoveryForm.current_password) return

  try {
    isSubmitting.value = true
    const response = await SyncService.createRecovery({
      current_password: recoveryForm.current_password,
    })

    generatedCode.value = response.data.recovery_code
    generatedCodeKind.value = 'recovery'
    expiresAt.value = ''
    recoveryForm.current_password = ''
  } catch (error) {
    ElNotification({
      title: 'Recovery Kit',
      message: getErrorMessage(error, 'Не удалось создать Recovery Kit'),
      type: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

async function copyGeneratedCode() {
  if (!generatedCode.value) return

  try {
    await navigator.clipboard.writeText(generatedCode.value)
    ElNotification({ title: codeTitle.value, message: 'Код скопирован', type: 'success' })
  } catch {
    ElNotification({ title: codeTitle.value, message: 'Не удалось скопировать код', type: 'error' })
  }
}
</script>

<template>
  <ElDialog
    v-model="visible"
    title="Доступ к синхронизации"
    width="560px"
    @closed="handleClose"
  >
    <ElTabs v-if="!generatedCode" v-model="activeTab">
      <ElTabPane label="Новое устройство" name="pairing">
        <p class="mb-4 text-sm text-gray-600">
          Создайте одноразовый код и введите его на новом чистом устройстве.
        </p>
        <ElForm label-position="top" :model="pairingForm">
          <ElFormItem label="Текущий пароль" required>
            <ElInput v-model="pairingForm.current_password" type="password" show-password />
          </ElFormItem>
          <ElFormItem label="Название текущего устройства">
            <ElInput v-model="pairingForm.device_name" placeholder="Например, Основной ноутбук" />
          </ElFormItem>
        </ElForm>
        <div class="flex justify-end">
          <ElButton
            type="primary"
            :loading="isSubmitting"
            :disabled="!pairingForm.current_password"
            @click="createPairingCode"
          >
            Создать код
          </ElButton>
        </div>
      </ElTabPane>

      <ElTabPane label="Recovery Kit" name="recovery">
        <ElAlert
          class="mb-4"
          title="Новый Recovery Kit немедленно аннулирует предыдущий код."
          type="warning"
          :closable="false"
        />
        <p class="mb-4 text-sm text-gray-600">
          Сохраните код вне CashOrg: он нужен для восстановления, если других устройств не останется.
        </p>
        <ElForm label-position="top" :model="recoveryForm">
          <ElFormItem label="Текущий пароль" required>
            <ElInput v-model="recoveryForm.current_password" type="password" show-password />
          </ElFormItem>
        </ElForm>
        <div class="flex justify-end">
          <ElButton
            type="primary"
            :loading="isSubmitting"
            :disabled="!recoveryForm.current_password"
            @click="createRecoveryKit"
          >
            Создать Recovery Kit
          </ElButton>
        </div>
      </ElTabPane>
    </ElTabs>

    <template v-else>
      <ElAlert
        :title="generatedCodeKind === 'pairing' ? 'Передайте этот код только новому устройству.' : 'Сохраните код в надёжном месте вне CashOrg.'"
        type="warning"
        :closable="false"
        class="mb-4"
      />
      <ElInput :model-value="generatedCode" type="textarea" :rows="5" readonly />
      <p v-if="expiresAt" class="mt-3 text-sm text-gray-600">
        Код действует до: {{ new Date(expiresAt).toLocaleString('ru-RU') }}
      </p>
      <p v-else class="mt-3 text-sm text-gray-600">
        Recovery Kit действует до создания нового Recovery Kit.
      </p>
      <div class="mt-4 flex justify-end gap-2">
        <ElButton @click="copyGeneratedCode">Копировать</ElButton>
        <ElButton type="primary" @click="visible = false">Готово</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

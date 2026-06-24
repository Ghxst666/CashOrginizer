<script setup lang="ts">
import { SyncService } from '@/entities/sync'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { reactive, ref } from 'vue'

const visible = defineModel<boolean>({ required: true })
const emit = defineEmits<{
  completed: [syncCompleted: boolean]
}>()

const activeTab = ref<'pairing' | 'recovery'>('pairing')
const isSubmitting = ref(false)
const pairingForm = reactive({ pairing_code: '', device_name: '' })
const recoveryForm = reactive({ recovery_code: '', device_name: '' })

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
  }

  return fallback
}

function resetForms() {
  pairingForm.pairing_code = ''
  pairingForm.device_name = ''
  recoveryForm.recovery_code = ''
  recoveryForm.device_name = ''
}

async function joinWithPairingCode() {
  if (!pairingForm.pairing_code.trim()) return

  try {
    isSubmitting.value = true
    await SyncService.joinPairing({
      pairing_code: pairingForm.pairing_code.trim(),
      device_name: pairingForm.device_name.trim() || undefined,
    })
    resetForms()
    visible.value = false
    emit('completed', true)
  } catch (error) {
    ElNotification({
      title: 'Подключение устройства',
      message: getErrorMessage(error, 'Не удалось подключить устройство'),
      type: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

async function restoreWithRecoveryKit() {
  if (!recoveryForm.recovery_code.trim()) return

  try {
    isSubmitting.value = true
    const response = await SyncService.restoreRecovery({
      recovery_code: recoveryForm.recovery_code.trim(),
      device_name: recoveryForm.device_name.trim() || undefined,
    })
    const syncCompleted = response.data.sync_completed
    resetForms()
    visible.value = false
    emit('completed', syncCompleted)
  } catch (error) {
    ElNotification({
      title: 'Восстановление аккаунта',
      message: getErrorMessage(error, 'Не удалось восстановить аккаунт'),
      type: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <ElDialog v-model="visible" title="Подключить устройство" width="560px" @closed="resetForms">
    <ElAlert
      class="mb-4"
      title="Подключение работает только на новом устройстве без локального аккаунта."
      type="warning"
      :closable="false"
    />
    <ElTabs v-model="activeTab">
      <ElTabPane label="Одноразовый код" name="pairing">
        <ElForm label-position="top" :model="pairingForm">
          <ElFormItem label="Код подключения" required>
            <ElInput v-model="pairingForm.pairing_code" type="textarea" :rows="4" />
          </ElFormItem>
          <ElFormItem label="Название нового устройства">
            <ElInput v-model="pairingForm.device_name" placeholder="Например, Рабочий компьютер" />
          </ElFormItem>
        </ElForm>
        <div class="flex justify-end">
          <ElButton
            type="primary"
            :loading="isSubmitting"
            :disabled="!pairingForm.pairing_code.trim()"
            @click="joinWithPairingCode"
          >
            Подключить
          </ElButton>
        </div>
      </ElTabPane>

      <ElTabPane label="Recovery Kit" name="recovery">
        <ElForm label-position="top" :model="recoveryForm">
          <ElFormItem label="Recovery Kit" required>
            <ElInput v-model="recoveryForm.recovery_code" type="textarea" :rows="4" />
          </ElFormItem>
          <ElFormItem label="Название нового устройства">
            <ElInput v-model="recoveryForm.device_name" placeholder="Например, Новый ноутбук" />
          </ElFormItem>
        </ElForm>
        <div class="flex justify-end">
          <ElButton
            type="primary"
            :loading="isSubmitting"
            :disabled="!recoveryForm.recovery_code.trim()"
            @click="restoreWithRecoveryKit"
          >
            Восстановить
          </ElButton>
        </div>
      </ElTabPane>
    </ElTabs>
  </ElDialog>
</template>

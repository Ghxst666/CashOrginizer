<script setup lang="ts">
import { ElDialog } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { useCreateAccount } from '@/entities/transaction/invoices'
import type { accountsCreateRequest } from '@/entities/transaction/invoices/types/invoices.types'
import { useGroupsQuery } from '@/entities/transaction/groups'

const props = defineProps<{ title: string }>()

const NO_GROUP = 'no-group'
const ACCOUNT_TYPES = [
  { label: 'Банк', value: 'bank' },
  { label: 'Наличные', value: 'cash' },
  { label: 'Имущество', value: 'property' },
  { label: 'Кредитная карта', value: 'creditcard' },
  { label: 'Дебетовая карта', value: 'debitcard' },
  { label: 'Инвестиции', value: 'investments' },
  { label: 'Долг', value: 'debt' },
  { label: 'Займ', value: 'loan' },
  { label: 'Дебиторский', value: 'receivable' },
  { label: 'Налоговый', value: 'tax' },
]
type AccountField = 'title' | 'type' | 'start_amount' | 'min_amount' | 'credit_limit_amount' | 'note' | 'status' | 'group_id' | 'currency'
type NewAccountFormData = Omit<accountsCreateRequest, 'group_id'> & { group_id: number | typeof NO_GROUP }

const { mutate, isPending, isSuccess } = useCreateAccount()
const isOpen = defineModel<boolean>({ default: false })
const { data: groups, isLoading: isGroupsLoading } = useGroupsQuery(isOpen)
const activeField = ref<AccountField>('title')
const newAccountFormData = ref<NewAccountFormData>(emptyForm())
const disabled = computed(() => isPending.value)
const typeLabel = computed(() => ACCOUNT_TYPES.find(option => option.value === newAccountFormData.value.type)?.label || 'Не выбран')
const groupLabel = computed(() => newAccountFormData.value.group_id === NO_GROUP
  ? 'Без группы'
  : groups.value?.find(group => group.id === newAccountFormData.value.group_id)?.title || 'Не выбрана')

function emptyForm(): NewAccountFormData {
  return { title: '', type: '', start_amount: 0, min_amount: 0, credit_limit_amount: 0, note: '', status: true, group_id: NO_GROUP, currency: 'RUB' }
}

function handleCreate() {
  mutate({
    ...newAccountFormData.value,
    start_amount: normalizeAmount(newAccountFormData.value.start_amount),
    min_amount: normalizeAmount(newAccountFormData.value.min_amount),
    credit_limit_amount: normalizeAmount(newAccountFormData.value.credit_limit_amount),
    group_id: newAccountFormData.value.group_id === NO_GROUP ? null : newAccountFormData.value.group_id,
  })
}

function normalizeAmount(value: string | number) {
  const amount = Number(String(value).replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(amount) ? amount : 0
}

function handleCloseDialog() {
  isOpen.value = false
  newAccountFormData.value = emptyForm()
  activeField.value = 'title'
}

watch(isSuccess, (success) => {
  if (success) handleCloseDialog()
})
</script>

<template>
  <ElDialog v-model="isOpen" :title="props.title" width="900">
    <div class="account-editor-layout">
      <ElScrollbar class="account-editor-layout__form">
        <div class="account-settings">
          <div class="account-setting-row"><span>Название</span><ElInput v-model="newAccountFormData.title" @focus="activeField = 'title'" /></div>
          <div class="account-setting-row"><span>Тип</span><ElInput :model-value="typeLabel" readonly @focus="activeField = 'type'" @click="activeField = 'type'" /></div>
          <div class="account-setting-row"><span>Начальный баланс</span><ElInput v-model="newAccountFormData.start_amount" @focus="activeField = 'start_amount'" /></div>
          <div class="account-setting-row"><span>Минимальный баланс</span><ElInput v-model="newAccountFormData.min_amount" @focus="activeField = 'min_amount'" /></div>
          <div v-if="newAccountFormData.type === 'creditcard'" class="account-setting-row"><span>Кредитный лимит</span><ElInput :model-value="String(newAccountFormData.credit_limit_amount)" readonly @focus="activeField = 'credit_limit_amount'" @click="activeField = 'credit_limit_amount'" /></div>
          <div class="account-setting-row"><span>Примечание</span><ElInput :model-value="newAccountFormData.note" readonly @focus="activeField = 'note'" @click="activeField = 'note'" /></div>
          <div class="account-setting-row"><span>Статус</span><ElInput :model-value="newAccountFormData.status ? 'Открытый' : 'Закрытый'" readonly @focus="activeField = 'status'" @click="activeField = 'status'" /></div>
          <div class="account-setting-row"><span>Группа счетов</span><ElInput :model-value="groupLabel" readonly @focus="activeField = 'group_id'" @click="activeField = 'group_id'" /></div>
          <div class="account-setting-row"><span>Валюта</span><ElInput :model-value="newAccountFormData.currency === 'USD' ? 'Доллар США (USD)' : 'Российский рубль (RUB)'" readonly @focus="activeField = 'currency'" @click="activeField = 'currency'" /></div>
        </div>
      </ElScrollbar>

      <ElScrollbar>
        <aside class="account-detail-panel">
          <ElInput v-if="activeField === 'title'" v-model="newAccountFormData.title" placeholder="Название" autofocus />
          <ElInput v-else-if="activeField === 'start_amount'" v-model="newAccountFormData.start_amount" placeholder="Начальный баланс" />
          <ElInput v-else-if="activeField === 'min_amount'" v-model="newAccountFormData.min_amount" placeholder="Минимальный баланс" />
          <ElInput v-else-if="activeField === 'credit_limit_amount'" v-model="newAccountFormData.credit_limit_amount" placeholder="Кредитный лимит" />
          <ElInput v-else-if="activeField === 'note'" v-model="newAccountFormData.note" type="textarea" :rows="40" placeholder="Примечание" />
          <template v-else-if="activeField === 'type'"><ElButton v-for="option in ACCOUNT_TYPES" :key="option.value" class="account-option" :type="newAccountFormData.type === option.value ? 'primary' : 'default'" @click="newAccountFormData.type = option.value">{{ option.label }}</ElButton></template>
          <template v-else-if="activeField === 'status'"><ElButton class="account-option" :type="newAccountFormData.status ? 'primary' : 'default'" @click="newAccountFormData.status = true">Открытый</ElButton><ElButton class="account-option" :type="!newAccountFormData.status ? 'primary' : 'default'" @click="newAccountFormData.status = false">Закрытый</ElButton></template>
          <template v-else-if="activeField === 'group_id'"><ElButton class="account-option" :type="newAccountFormData.group_id === NO_GROUP ? 'primary' : 'default'" @click="newAccountFormData.group_id = NO_GROUP">Без группы</ElButton><ElButton v-for="group in groups" :key="group.id" class="account-option" :loading="isGroupsLoading" :type="newAccountFormData.group_id === group.id ? 'primary' : 'default'" @click="newAccountFormData.group_id = group.id">{{ group.title }}</ElButton></template>
          <template v-else-if="activeField === 'currency'"><ElButton class="account-option" :type="newAccountFormData.currency === 'RUB' ? 'primary' : 'default'" @click="newAccountFormData.currency = 'RUB'">Российский рубль (RUB)</ElButton><ElButton class="account-option" :type="newAccountFormData.currency === 'USD' ? 'primary' : 'default'" @click="newAccountFormData.currency = 'USD'">Доллар США (USD)</ElButton></template>
        </aside>
      </ElScrollbar>
    </div>

    <template #footer><div class="flex justify-between"><ElButton @click="handleCloseDialog">Отмена</ElButton><ElButton type="primary" :disabled="disabled" @click="handleCreate">Готово</ElButton></div></template>
  </ElDialog>
</template>

<style scoped>
.account-editor-layout { display: grid; grid-template-columns: minmax(0, 1fr) 300px; min-height: 400px; }
.account-editor-layout__form { border-right: 1px solid #dcdfe6; }
.account-settings { padding: 12px 0; }
.account-setting-row { display: grid; grid-template-columns: 180px minmax(0, 1fr); align-items: center; gap: 16px; min-height: 56px; padding: 6px 20px; border-bottom: 1px solid #eef0f2; }
.account-setting-row > span { color: #6f7782; text-align: right; }
.account-setting-row :deep(.el-input__wrapper) { cursor: pointer; }
.account-detail-panel { display: flex; flex-direction: column; gap: 8px; padding: 16px; }
.account-option { width: 100%; justify-content: flex-start; margin: 0; white-space: normal; height: auto; min-height: 32px; }

.account-editor-layout__form {
  border-right: 1px solid #dcdfe6;
  padding: 16px;
  border-radius: 12px;
  background: #eef3f4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04);
}

.account-editor-layout__form :deep(.el-form-item__label) {
  font-weight: 700;
  color: #2f3a3d;
  margin-bottom: 6px;
}

.account-editor-layout__form :deep(.el-input__wrapper),
.account-editor-layout__form :deep(.el-select__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(120, 140, 145, 0.18) inset;
}
</style>

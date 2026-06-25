<script setup lang="ts">
import { ElDialog, ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { useAccountsEdit, useDelete } from '@/entities/transaction/invoices'
import type { accountEditRequesData } from '@/entities/transaction/invoices/types/invoices.types'
import { useGroupsQuery } from '@/entities/transaction/groups'

const props = defineProps<{ title: string, id: number | null, updateData: accountEditRequesData }>()

const NO_GROUP = 'no-group'
const ACCOUNT_TYPES = [
  { label: 'Банк', value: 'bank' }, { label: 'Наличные', value: 'cash' }, { label: 'Имущество', value: 'property' },
  { label: 'Кредитная карта', value: 'creditcard' }, { label: 'Дебетовая карта', value: 'debitcard' }, { label: 'Инвестиции', value: 'investments' },
  { label: 'Долг', value: 'debt' }, { label: 'Займ', value: 'loan' }, { label: 'Дебиторский', value: 'receivable' }, { label: 'Налоговый', value: 'tax' },
]
type AccountField = 'title' | 'type' | 'start_amount' | 'min_amount' | 'credit_limit_amount' | 'note' | 'status' | 'group_id' | 'currency' | 'exchange_rate'
type EditAccountFormData = Omit<accountEditRequesData, 'group_id'> & { group_id: number | typeof NO_GROUP }

const isOpen = defineModel<boolean>({ default: false })
const { mutate, isPending } = useAccountsEdit()
const { mutate: deleteAccount, isPending: isDeleting } = useDelete()
const { data: groups, isLoading: isGroupsLoading } = useGroupsQuery()
const activeField = ref<AccountField>('title')
const originalCurrency = ref<'RUB' | 'USD'>('RUB')
const formData = ref<EditAccountFormData>(emptyForm())
const disabled = computed(() => isPending.value)
const currencyChangeRequiresRate = computed(() => formData.value.currency !== originalCurrency.value)
const typeLabel = computed(() => ACCOUNT_TYPES.find(option => option.value === formData.value.type)?.label || 'Не выбран')
const groupLabel = computed(() => formData.value.group_id === NO_GROUP
  ? 'Без группы'
  : groups.value?.find(group => group.id === formData.value.group_id)?.title || 'Не выбрана')

function emptyForm(): EditAccountFormData {
  return { title: '', type: '', start_amount: 0, min_amount: 0, credit_limit_amount: 0, note: '', status: true, group_id: NO_GROUP, currency: 'RUB', exchange_rate: null }
}

function setCurrency(currency: 'RUB' | 'USD') {
  formData.value.currency = currency
  activeField.value = currencyChangeRequiresRate.value ? 'exchange_rate' : 'currency'
}

function handleUpdate() {
  if (!props.id) return

  const payload: any = { ...formData.value }
  if (payload.group_id === NO_GROUP) payload.group_id = null
  payload.start_amount = normalizeAmount(payload.start_amount)
  payload.min_amount = normalizeAmount(payload.min_amount)

  if (currencyChangeRequiresRate.value) {
    const exchangeRate = Number(String(payload.exchange_rate ?? '').replace(',', '.'))
    if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
      ElMessage.error({ message: 'Укажите корректный курс обмена', plain: true })
      return
    }
    payload.exchange_rate = exchangeRate
  }

  if (payload.type !== 'creditcard') delete payload.credit_limit_amount
  else payload.credit_limit_amount = normalizeAmount(payload.credit_limit_amount)

  mutate({ account_id: props.id, data: payload }, { onSuccess: () => { isOpen.value = false } })
}

function normalizeAmount(value: string | number | null | undefined) {
  const amount = Number(String(value ?? 0).replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(amount) ? amount : 0
}

function handleDelete() {
  if (!props.id) return
  deleteAccount({ account_id: props.id }, { onSuccess: () => { isOpen.value = false } })
}

watch(() => props.updateData, (value) => {
  if (!value) return
  originalCurrency.value = value.currency
  formData.value = { ...value, group_id: value.group_id ?? NO_GROUP }
  activeField.value = 'title'
}, { immediate: true })
</script>

<template>
  <ElDialog v-model="isOpen" :title="props.title" width="900">
    <div class="account-editor-layout">
      <ElScrollbar height="400px" class="account-editor-layout__form">
        <div class="account-settings">
          <div class="account-setting-row"><span>Название</span><ElInput v-model="formData.title" @focus="activeField = 'title'" /></div>
          <div class="account-setting-row"><span>Тип</span><ElInput :model-value="typeLabel" readonly @focus="activeField = 'type'" @click="activeField = 'type'" /></div>
          <div class="account-setting-row"><span>Начальный баланс</span><ElInput v-model="formData.start_amount" @focus="activeField = 'start_amount'" /></div>
          <div class="account-setting-row"><span>Минимальный баланс</span><ElInput v-model="formData.min_amount" @focus="activeField = 'min_amount'" /></div>
          <div v-if="formData.type === 'creditcard'" class="account-setting-row"><span>Кредитный лимит</span><ElInput :model-value="String(formData.credit_limit_amount)" readonly @focus="activeField = 'credit_limit_amount'" @click="activeField = 'credit_limit_amount'" /></div>
          <div class="account-setting-row"><span>Примечание</span><ElInput :model-value="formData.note" readonly @focus="activeField = 'note'" @click="activeField = 'note'" /></div>
          <div class="account-setting-row"><span>Статус</span><ElInput :model-value="formData.status ? 'Открытый' : 'Закрытый'" readonly @focus="activeField = 'status'" @click="activeField = 'status'" /></div>
          <div class="account-setting-row"><span>Группа счетов</span><ElInput :model-value="groupLabel" readonly @focus="activeField = 'group_id'" @click="activeField = 'group_id'" /></div>
          <div class="account-setting-row"><span>Валюта</span><ElInput :model-value="formData.currency === 'USD' ? 'Доллар США (USD)' : 'Российский рубль (RUB)'" readonly @focus="activeField = 'currency'" @click="activeField = 'currency'" /></div>
          <div v-if="currencyChangeRequiresRate" class="account-setting-row"><span>Курс обмена</span><ElInput :model-value="formData.exchange_rate === null ? '' : String(formData.exchange_rate)" readonly @focus="activeField = 'exchange_rate'" @click="activeField = 'exchange_rate'" /></div>
        </div>
      </ElScrollbar>

      <aside class="account-detail-panel">
        <ElInput v-if="activeField === 'title'" v-model="formData.title" placeholder="Название" autofocus />
        <ElInput v-else-if="activeField === 'start_amount'" v-model="formData.start_amount" placeholder="Начальный баланс" />
        <ElInput v-else-if="activeField === 'min_amount'" v-model="formData.min_amount" placeholder="Минимальный баланс" />
        <ElInput v-else-if="activeField === 'credit_limit_amount'" v-model="formData.credit_limit_amount" placeholder="Кредитный лимит" />
        <ElInput v-else-if="activeField === 'note'" v-model="formData.note" type="textarea" :rows="8" placeholder="Примечание" />
        <ElInput v-else-if="activeField === 'exchange_rate'" v-model="formData.exchange_rate" placeholder="Например, 73" />
        <template v-else-if="activeField === 'type'"><ElButton v-for="option in ACCOUNT_TYPES" :key="option.value" class="account-option" :type="formData.type === option.value ? 'primary' : 'default'" @click="formData.type = option.value">{{ option.label }}</ElButton></template>
        <template v-else-if="activeField === 'status'"><ElButton class="account-option" :type="formData.status ? 'primary' : 'default'" @click="formData.status = true">Открытый</ElButton><ElButton class="account-option" :type="!formData.status ? 'primary' : 'default'" @click="formData.status = false">Закрытый</ElButton></template>
        <template v-else-if="activeField === 'group_id'"><ElButton class="account-option" :type="formData.group_id === NO_GROUP ? 'primary' : 'default'" @click="formData.group_id = NO_GROUP">Без группы</ElButton><ElButton v-for="group in groups" :key="group.id" class="account-option" :loading="isGroupsLoading" :type="formData.group_id === group.id ? 'primary' : 'default'" @click="formData.group_id = group.id">{{ group.title }}</ElButton></template>
        <template v-else-if="activeField === 'currency'"><ElButton class="account-option" :type="formData.currency === 'RUB' ? 'primary' : 'default'" @click="setCurrency('RUB')">Российский рубль (RUB)</ElButton><ElButton class="account-option" :type="formData.currency === 'USD' ? 'primary' : 'default'" @click="setCurrency('USD')">Доллар США (USD)</ElButton></template>
      </aside>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <ElPopconfirm width="220" :icon="undefined" title="Вы хотите удалить счёт?" @confirm="handleDelete"><template #reference><ElButton type="danger" :loading="isDeleting" :disabled="isPending">Удалить</ElButton></template></ElPopconfirm>
        <ElButton @click="isOpen = false">Отмена</ElButton><ElButton type="primary" :disabled="disabled" @click="handleUpdate">Готово</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped>
.account-editor-layout { display: grid; grid-template-columns: minmax(0, 1fr) 300px; min-height: 400px; }
.account-editor-layout__form { border-right: 1px solid #dcdfe6; }
.account-settings { padding: 12px 0; }
.account-setting-row { display: grid; grid-template-columns: 180px minmax(0, 1fr); align-items: center; gap: 16px; min-height: 56px; padding: 6px 20px; border-bottom: 1px solid #eef0f2; }
.account-setting-row > span { color: #6f7782; text-align: right; }
.account-setting-row :deep(.el-input__wrapper) { cursor: pointer; }
.account-detail-panel { display: flex; flex-direction: column; gap: 8px; padding: 16px; overflow: auto; }
.account-option { width: 100%; justify-content: flex-start; margin: 0; white-space: normal; height: auto; min-height: 32px; }
</style>

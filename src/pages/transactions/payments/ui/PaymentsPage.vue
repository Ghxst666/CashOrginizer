<script setup lang="ts">
import PaymentsTable from '@/entities/payments/PaymentsTable.vue'
import PaymentsHeader from './PaymentsHeader.vue'
import CreatePaymentDialog from './CreatePaymentDialog.vue'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { PaymentsFilter } from '../payments-filter'
import SidePropertiesPanel from '@/shared/ui/SidePropertiesPanel.vue'
import type { PaymentListItemResponse, PaymentType } from '@/entities/transaction/payments/types/payments.types'
import { usePaymentsQuery } from '@/entities/transaction/payments'
import TransactionBalanceBar from '@/shared/ui/TransactionBalanceBar.vue'

const newPayDialogVisible = ref<boolean>(false)
const paymentsFilter = ref<PaymentsFilter>({ type: 'all' })
const route = useRoute()
const router = useRouter()
const isPropertiesOpen = ref(false)
const selectedPayment = ref<PaymentListItemResponse | null>(null)
const { data: paymentsData } = usePaymentsQuery()
const totalBalance = computed(() => (paymentsData.value ?? []).reduce(
  (total, payment) => total + getPaymentAmountInRub(payment),
  0,
))

function handleOpenDialog() {
  newPayDialogVisible.value = true
}

function handleCloseDialog() {
  newPayDialogVisible.value = false
}

function handleShowProperties() {
  isPropertiesOpen.value = true
}

function handleSelectPayment(payment: PaymentListItemResponse) {
  selectedPayment.value = payment
}

function handleSelectFilter(filter: PaymentsFilter) {
  paymentsFilter.value = filter

  router.replace({
    query: {
      ...route.query,
      ...getPaymentsFilterQuery(filter),
    },
  })
}

function getQueryValue(value: unknown) {
  return Array.isArray(value) ? value[0] : value
}

function getQueryString(query: Record<string, unknown>, key: string) {
  return String(getQueryValue(query[key]) || '')
}

function getQueryNumber(query: Record<string, unknown>, key: string) {
  const value = Number(getQueryString(query, key))

  return Number.isFinite(value) && value > 0 ? value : null
}

function getPaymentsFilterQuery(filter: PaymentsFilter) {
  const clearedFilterQuery = {
    account_id: undefined,
    account_ids: undefined,
    account_title: undefined,
    group_id: undefined,
    group_ids: undefined,
    group_title: undefined,
    purpose_id: undefined,
    purpose_title: undefined,
    project_id: undefined,
    project_title: undefined,
    category_id: undefined,
    category_title: undefined,
  }

  if (filter.type === 'selection') {
    return {
      ...clearedFilterQuery,
      account_ids: filter.accountIds.join(',') || undefined,
      group_ids: filter.groupIds.join(',') || undefined,
    }
  }
  if (filter.type === 'account') {
    return {
      ...clearedFilterQuery,
      account_id: String(filter.accountId),
      account_title: filter.title,
    }
  }
  if (filter.type === 'group') {
    return {
      ...clearedFilterQuery,
      group_id: String(filter.groupId),
      group_title: filter.title,
    }
  }
  if (filter.type === 'purpose') {
    return {
      ...clearedFilterQuery,
      purpose_id: String(filter.purposeId),
      purpose_title: filter.title,
    }
  }
  if (filter.type === 'project') {
    return {
      ...clearedFilterQuery,
      project_id: String(filter.projectId),
      project_title: filter.title,
    }
  }
  if (filter.type === 'category') {
    return {
      ...clearedFilterQuery,
      category_id: String(filter.categoryId),
      category_title: filter.title,
    }
  }

  return clearedFilterQuery
}

function formatMoney(value?: string | null) {
  if (!value)
    return '0,00 р'

  const numericValue = Number(value)

  if (Number.isFinite(numericValue)) {
    return `${numericValue.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} р`
  }

  return `${value} р`
}

function paymentTypeTitle(type?: PaymentType | null) {
  if (type === 'expenses') return 'Расход'
  if (type === 'profits') return 'Доход'
  if (type === 'transfers') return 'Перевод'

  return 'Не указан'
}

function paymentBalanceTitle(payment: PaymentListItemResponse) {
  if (payment.type === 'transfers')
    return payment.to_account_title || 'Счет не задан'

  return formatMoney(payment.amount)
}

function displayedPaymentAmount(payment: PaymentListItemResponse) {
  if (payment.type === 'transfers' && payment.to_amount !== null && payment.to_amount !== undefined) {
    return payment.to_amount
  }

  return payment.amount
}

function amountToNumber(amount?: string | number | null) {
  const parsedAmount = Number(String(amount ?? 0).replace(/\s/g, '').replace(',', '.'))

  return Number.isFinite(parsedAmount) ? parsedAmount : 0
}

function getPaymentAmountInRub(payment: PaymentListItemResponse) {
  const amount = amountToNumber(payment.amount)
  const currency = payment.account_currency?.toUpperCase()

  if (currency === 'USD') return amount * amountToNumber(payment.exchange_rate)

  return amount
}

watch(
  () => route.query,
  (query) => {
    const purposeId = getQueryNumber(query, 'purpose_id')
    const projectId = getQueryNumber(query, 'project_id')
    const categoryId = getQueryNumber(query, 'category_id')
    const accountId = getQueryNumber(query, 'account_id')
    const groupId = getQueryNumber(query, 'group_id')
    const accountIds = String(getQueryValue(query.account_ids) || '')
      .split(',').map(Number).filter(id => Number.isFinite(id) && id > 0)
    const groupIds = String(getQueryValue(query.group_ids) || '')
      .split(',').map(Number).filter(id => Number.isFinite(id) && id > 0)

    if (purposeId) {
      paymentsFilter.value = {
        type: 'purpose',
        purposeId,
        title: getQueryString(query, 'purpose_title') || undefined,
      }
      return
    }

    if (projectId) {
      paymentsFilter.value = {
        type: 'project',
        projectId,
        title: getQueryString(query, 'project_title') || undefined,
      }
      return
    }

    if (categoryId) {
      paymentsFilter.value = {
        type: 'category',
        categoryId,
        title: getQueryString(query, 'category_title') || undefined,
      }
      return
    }

    if (accountId) {
      paymentsFilter.value = {
        type: 'account',
        accountId,
        title: getQueryString(query, 'account_title') || undefined,
      }
      return
    }

    if (groupId) {
      paymentsFilter.value = {
        type: 'group',
        groupId,
        title: getQueryString(query, 'group_title') || undefined,
      }
      return
    }

    if (accountIds.length || groupIds.length) {
      paymentsFilter.value = {
        type: 'selection',
        accountIds,
        groupIds,
      }
      return
    }

    paymentsFilter.value = { type: 'all' }
  },
  { immediate: true },
)
</script>

<template>
  <CreatePaymentDialog
    v-model:new-pay="newPayDialogVisible"
    @close="handleCloseDialog"
  />
  <div class="h-full flex">
    <div class="flex-1 min-w-0 flex flex-col">
      <PaymentsHeader
        :selected-filter="paymentsFilter"
        @open-dialog="handleOpenDialog"
        @select-filter="handleSelectFilter"
        @show-properties="handleShowProperties"
      />
      <PaymentsTable
        class="flex-1 min-h-0"
        :filter="paymentsFilter"
        @select="handleSelectPayment"
      />
      <TransactionBalanceBar
        :balance="totalBalance"
      />
    </div>

    <SidePropertiesPanel
      v-model="isPropertiesOpen"
      title="Свойства платежа"
      width="400px"
    >
      <template v-if="selectedPayment">
        <ElForm
          :model="selectedPayment"
          label-position="top"
          class="payment-properties-form"
        >
          <ElFormItem label="Сумма">
            <span class="text-[#374151] font-semibold">{{ formatMoney(displayedPaymentAmount(selectedPayment)) }}</span>
          </ElFormItem>
          <ElFormItem label="Счет">
            <span class="text-[#374151] font-semibold">{{ selectedPayment.account_title || 'Счет не задан' }}</span>
          </ElFormItem>
          <ElFormItem label="Баланс">
            <span class="text-[#374151] font-semibold">{{ paymentBalanceTitle(selectedPayment) }}</span>
          </ElFormItem>
          <ElFormItem label="Тип">
            <span class="text-[#6b7280]">{{ paymentTypeTitle(selectedPayment.type) }}</span>
          </ElFormItem>
          <ElFormItem label="Дата">
            <span class="text-[#6b7280]">{{ selectedPayment.payment_date || 'Дата не задана' }}</span>
          </ElFormItem>
          <ElFormItem label="Номер">
            <span class="text-[#6b7280]">{{ selectedPayment.number || 'Номер не задан' }}</span>
          </ElFormItem>
          <ElFormItem label="Примечание">
            <span class="text-[#6b7280]">{{ selectedPayment.note || 'Примечание не задано' }}</span>
          </ElFormItem>
        </ElForm>
      </template>

      <template v-else>
        <div class="h-full flex items-center justify-center text-[#9ca3af] text-sm">
          Выбери платеж в таблице, чтобы посмотреть свойства
        </div>
      </template>
    </SidePropertiesPanel>
  </div>
</template>

<style scoped>
:deep(.payment-properties-form .el-form-item__label) {
  color: #000;
  font-size: 16px;
}
</style>

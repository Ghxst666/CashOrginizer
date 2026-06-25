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

  if (filter.type === 'selection') {
    router.replace({
      query: {
        ...route.query,
        account_ids: filter.accountIds.join(',') || undefined,
        group_ids: filter.groupIds.join(',') || undefined,
      },
    })
    return
  }

  router.replace({
    query: {
      ...route.query,
      account_ids: undefined,
      group_ids: undefined,
    },
  })
}

function getQueryValue(value: unknown) {
  return Array.isArray(value) ? value[0] : value
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
    const accountIds = String(getQueryValue(query.account_ids) || getQueryValue(query.account_id) || '')
      .split(',').map(Number).filter(id => Number.isFinite(id) && id > 0)
    const groupIds = String(getQueryValue(query.group_ids) || getQueryValue(query.group_id) || '')
      .split(',').map(Number).filter(id => Number.isFinite(id) && id > 0)

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

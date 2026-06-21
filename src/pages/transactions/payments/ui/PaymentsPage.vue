<script setup lang="ts">
import PaymentsTable from '@/entities/payments/PaymentsTable.vue'
import PaymentsHeader from './PaymentsHeader.vue'
import CreatePaymentDialog from './CreatePaymentDialog.vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { PaymentsFilter } from '../payments-filter'
import SidePropertiesPanel from '@/shared/ui/SidePropertiesPanel.vue'
import type { PaymentListItemResponse, PaymentType } from '@/entities/transaction/payments/types/payments.types'

const newPayDialogVisible = ref<boolean>(false)
const paymentsFilter = ref<PaymentsFilter>({ type: 'all' })
const route = useRoute()
const router = useRouter()
const isPropertiesOpen = ref(false)
const selectedPayment = ref<PaymentListItemResponse | null>(null)

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

  if (filter.type === 'account') {
    router.replace({
      query: {
        ...route.query,
        account_id: String(filter.id),
        account_title: filter.title,
        group_id: undefined,
        group_title: undefined,
      },
    })
    return
  }

  if (filter.type === 'group') {
    router.replace({
      query: {
        ...route.query,
        group_id: String(filter.id),
        group_title: filter.title,
        account_id: undefined,
        account_title: undefined,
      },
    })
    return
  }

  router.replace({
    query: {
      ...route.query,
      account_id: undefined,
      account_title: undefined,
      group_id: undefined,
      group_title: undefined,
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

watch(
  () => route.query,
  (query) => {
    const accountId = Number(getQueryValue(query.account_id))
    const groupId = Number(getQueryValue(query.group_id))

    if (Number.isFinite(accountId) && accountId > 0) {
      paymentsFilter.value = {
        type: 'account',
        id: accountId,
        title: String(getQueryValue(query.account_title) || 'Счет'),
      }
      return
    }

    if (Number.isFinite(groupId) && groupId > 0) {
      paymentsFilter.value = {
        type: 'group',
        id: groupId,
        title: String(getQueryValue(query.group_title) || 'Группа счетов'),
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
        :filter="paymentsFilter"
        @select="handleSelectPayment"
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
            <span class="text-[#374151] font-semibold">{{ formatMoney(selectedPayment.amount) }}</span>
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

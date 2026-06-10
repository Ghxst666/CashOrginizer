<script setup lang="ts">
import PaymentsTable from '@/entities/payments/PaymentsTable.vue'
import PaymentsHeader from './PaymentsHeader.vue'
import CreatePaymentDialog from './CreatePaymentDialog.vue'
import { ref } from 'vue'
import type { PaymentsFilter } from '../payments-filter'

const newPayDialogVisible = ref<boolean>(false)
const paymentsFilter = ref<PaymentsFilter>({ type: 'all' })

function handleOpenDialog() {
  newPayDialogVisible.value = true
}

function handleCloseDialog() {
  newPayDialogVisible.value = false
}

function handleSelectFilter(filter: PaymentsFilter) {
  paymentsFilter.value = filter
}
</script>

<template>
  <CreatePaymentDialog
    v-model:new-pay="newPayDialogVisible"
    @close="handleCloseDialog"
  />
  <PaymentsHeader
    :selected-filter="paymentsFilter"
    @open-dialog="handleOpenDialog"
    @select-filter="handleSelectFilter"
  />
  <PaymentsTable :filter="paymentsFilter" />
</template>

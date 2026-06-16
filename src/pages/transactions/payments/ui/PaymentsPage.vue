<script setup lang="ts">
import PaymentsTable from '@/entities/payments/PaymentsTable.vue'
import PaymentsHeader from './PaymentsHeader.vue'
import CreatePaymentDialog from './CreatePaymentDialog.vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { PaymentsFilter } from '../payments-filter'

const newPayDialogVisible = ref<boolean>(false)
const paymentsFilter = ref<PaymentsFilter>({ type: 'all' })
const route = useRoute()
const router = useRouter()

function handleOpenDialog() {
  newPayDialogVisible.value = true
}

function handleCloseDialog() {
  newPayDialogVisible.value = false
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
  <PaymentsHeader
    :selected-filter="paymentsFilter"
    @open-dialog="handleOpenDialog"
    @select-filter="handleSelectFilter"
  />
  <PaymentsTable :filter="paymentsFilter" />
</template>

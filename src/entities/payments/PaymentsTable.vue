<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import EditPaymentDialog from '@/pages/transactions/payments/ui/EditPaymentDialog.vue'
import { filterRowsBySearch } from '@/shared/lib/search'
import { useHeaderSearchStore } from '@/shared/store/header-search.store'
import {
    useDeletePayment,
    usePaymentsFilteredByAccountQuery,
    usePaymentsFilteredByGroupQuery,
    usePaymentsInfiniteScrollQuery,
    usePaymentsQuery,
} from '@/entities/transaction/payments'
import type { PaymentListItemResponse } from '@/entities/transaction/payments/types/payments.types'
import type { PaymentsFilter } from '@/pages/transactions/payments/payments-filter'

const props = defineProps<{
    filter: PaymentsFilter
}>()

const emit = defineEmits<{
    select: [payment: PaymentListItemResponse]
}>()

const headerSearchStore = useHeaderSearchStore()
const isAllPayments = computed(() => props.filter.type === 'all')
const isAccountFilter = computed(() => props.filter.type === 'account')
const isGroupFilter = computed(() => props.filter.type === 'group')
const selectedAccountId = computed(() => props.filter.type === 'account' ? props.filter.id : 0)
const selectedGroupId = computed(() => props.filter.type === 'group' ? props.filter.id : 0)
const shouldLoadAllPaymentsForSearch = computed(() => isAllPayments.value && Boolean(headerSearchStore.debouncedQuery))

const {
    data: allPaymentsData,
    target,
    isLoading: isAllPaymentsLoading,
    isFetchingNextPage,
} = usePaymentsInfiniteScrollQuery(30, isAllPayments)

const accountPaymentsQuery = usePaymentsFilteredByAccountQuery(selectedAccountId, isAccountFilter)
const groupPaymentsQuery = usePaymentsFilteredByGroupQuery(selectedGroupId, isGroupFilter)
const allPaymentsSearchQuery = usePaymentsQuery(shouldLoadAllPaymentsForSearch)

const deletePayment = useDeletePayment()
const selectedPayment = ref<PaymentListItemResponse | null>(null)
const isOpenEdit = ref(false)

const tableData = computed(() => {
    if (props.filter.type === 'account') return accountPaymentsQuery.data.value ?? []
    if (props.filter.type === 'group') return groupPaymentsQuery.data.value ?? []
    if (headerSearchStore.debouncedQuery && allPaymentsSearchQuery.data.value) return allPaymentsSearchQuery.data.value

    return allPaymentsData.value?.pages.flat() ?? []
})

const filteredTableData = computed(() => filterRowsBySearch(
    tableData.value,
    headerSearchStore.debouncedQuery,
    payment => [
        payment.payment_date,
        payment.account_title,
        payment.to_account_title,
        payment.project,
        payment.amount,
        payment.note,
        payment.number,
    ],
))

const isLoading = computed(() => {
    if (props.filter.type === 'account') return accountPaymentsQuery.isLoading.value
    if (props.filter.type === 'group') return groupPaymentsQuery.isLoading.value
    if (headerSearchStore.debouncedQuery && allPaymentsSearchQuery.isLoading.value) return true

    return isAllPaymentsLoading.value
})

function handleOpenEditPayment(row: PaymentListItemResponse) {
    selectedPayment.value = { ...row }
    isOpenEdit.value = true
}

function handleRowClick(row: PaymentListItemResponse) {
    emit('select', row)
}

function handleDeletePayment(payment_id: number) {
    deletePayment.mutate({ payment_id })
}
</script>

<template>
    <div style="height: calc(100vh - 113px);">
        <EditPaymentDialog
            v-if="selectedPayment && isOpenEdit"
            :key="selectedPayment.id"
            v-model="isOpenEdit"
            :payment="selectedPayment"
        />

        <ElTable
            v-loading="isLoading"
            height="100%"
            border
            :data="filteredTableData"
            @row-click="handleRowClick"
        >
            <ElTableColumn width="100" prop="payment_date" label="Дата" />
            <ElTableColumn prop="account_title" label="Счет" />
            <ElTableColumn prop="project" label="Проект" />
            <ElTableColumn label="Сумма/Баланс">
                <template #default="{ row }">
                    <span>{{ row.amount }}  ₽</span>
                </template>
            </ElTableColumn>
            <ElTableColumn
                width="140px"
                align="center"
            >
                <template #default="{ row }">
                    <ElButton
                        type="primary"
                        :icon="EditPen"
                        @click="handleOpenEditPayment(row)"
                    />
                    <ElPopconfirm
                        width="220"
                        :icon="undefined"
                        title="Вы хотите удалить платеж?"
                    >
                        <template #reference>
                            <ElButton
                                type="danger"
                                :icon="Delete"
                                :loading="deletePayment.isPending.value"
                            />
                        </template>

                        <template #actions="{ cancel }">
                            <ElButton
                                size="small"
                                @click="cancel"
                            >
                                Нет
                            </ElButton>
                            <ElButton
                                type="danger"
                                size="small"
                                :loading="deletePayment.isPending.value"
                                @click="handleDeletePayment(row.id)"
                            >
                                Да
                            </ElButton>
                        </template>
                    </ElPopconfirm>
                </template>
            </ElTableColumn>

            <template #append>
                <div
                    v-if="isAllPayments"
                    ref="target"
                    class="h-px"
                />
                <div
                    v-if="isAllPayments && isFetchingNextPage"
                    class="py-2 text-center text-sm text-gray-500"
                >
                    Загрузка...
                </div>
            </template>
        </ElTable>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import EditPaymentDialog from '@/pages/transactions/payments/ui/EditPaymentDialog.vue'
import { filterRowsBySearch } from '@/shared/lib/search'
import { useHeaderSearchStore } from '@/shared/store/header-search.store'
import {
    usePaymentsFilteredInfiniteScrollQuery,
    usePaymentsInfiniteScrollQuery,
    usePaymentsQuery,
} from '@/entities/transaction/payments'
import { useAccountsQuery } from '@/entities/transaction/invoices'
import type { PaymentListItemResponse, PaymentType } from '@/entities/transaction/payments/types/payments.types'
import type { PaymentsFilter } from '@/pages/transactions/payments/payments-filter'
import type { PaymentsRemoteFilterType } from '@/entities/transaction/payments/composables/payments.queries'

const props = defineProps<{
    filter: PaymentsFilter
}>()

const emit = defineEmits<{
    select: [payment: PaymentListItemResponse]
}>()

const headerSearchStore = useHeaderSearchStore()
const isAllPayments = computed(() => props.filter.type === 'all')
const isSelectionFilter = computed(() => props.filter.type === 'selection')
const isRemoteFilter = computed(() => isPaymentRemoteFilter(props.filter))
const remoteFilterType = computed<PaymentsRemoteFilterType>(() => {
    if (props.filter.type === 'group') return 'group'
    if (props.filter.type === 'purpose') return 'purpose'
    if (props.filter.type === 'project') return 'project'
    if (props.filter.type === 'category') return 'category'

    return 'account'
})
const remoteFilterId = computed(() => {
    if (props.filter.type === 'account') return props.filter.accountId
    if (props.filter.type === 'group') return props.filter.groupId
    if (props.filter.type === 'purpose') return props.filter.purposeId
    if (props.filter.type === 'project') return props.filter.projectId
    if (props.filter.type === 'category') return props.filter.categoryId

    return 0
})
const shouldLoadAllPayments = computed(() => isSelectionFilter.value || (isAllPayments.value && Boolean(headerSearchStore.debouncedQuery)))

const {
    data: allPaymentsData,
    target,
    isLoading: isAllPaymentsLoading,
    isFetchingNextPage,
} = usePaymentsInfiniteScrollQuery(30, isAllPayments)

const {
    data: remotePaymentsData,
    target: remoteTarget,
    isLoading: isRemotePaymentsLoading,
    isFetchingNextPage: isFetchingRemoteNextPage,
} = usePaymentsFilteredInfiniteScrollQuery(remoteFilterType, remoteFilterId, 30, isRemoteFilter)

const allPaymentsSearchQuery = usePaymentsQuery(shouldLoadAllPayments)
const { data: accounts } = useAccountsQuery(true, isSelectionFilter)

const selectedPayment = ref<PaymentListItemResponse | null>(null)
const isOpenEdit = ref(false)

const tableData = computed(() => {
    if (isRemoteFilter.value) return remotePaymentsData.value?.pages.flat() ?? []
    if (isSelectionFilter.value) return allPaymentsSearchQuery.data.value ?? []
    if (headerSearchStore.debouncedQuery && allPaymentsSearchQuery.data.value) return allPaymentsSearchQuery.data.value

    return allPaymentsData.value?.pages.flat() ?? []
})

const filteredTableData = computed(() => filterRowsBySearch(
    tableData.value.filter(matchesSelectedAccounts),
    headerSearchStore.debouncedQuery,
    payment => [
        payment.payment_date,
        payment.account_title,
        payment.to_account_title,
        payment.type,
        formatedTypeName(payment.type),
        payment.amount,
        payment.to_amount,
        payment.note,
        payment.number,
    ],
))

const isLoading = computed(() => {
    if (isRemoteFilter.value) return isRemotePaymentsLoading.value
    if (shouldLoadAllPayments.value && allPaymentsSearchQuery.isLoading.value) return true

    return isAllPaymentsLoading.value
})

function isPaymentRemoteFilter(filter: PaymentsFilter): filter is Extract<PaymentsFilter, { type: PaymentsRemoteFilterType }> {
    return filter.type === 'account'
        || filter.type === 'group'
        || filter.type === 'purpose'
        || filter.type === 'project'
        || filter.type === 'category'
}

function matchesSelectedAccounts(payment: PaymentListItemResponse) {
    if (props.filter.type !== 'selection') return true
    if (props.filter.accountIds.includes(payment.account_id)) return true

    const account = (accounts.value ?? []).find(item => item.id === payment.account_id)
    return Boolean(account?.group_id && props.filter.groupIds.includes(account.group_id))
}

function handleOpenEditPayment(row: PaymentListItemResponse) {
    selectedPayment.value = { ...row }
    isOpenEdit.value = true
}

function handleRowClick(row: PaymentListItemResponse) {
    emit('select', row)
}

function formatedTypeName(type?: PaymentType | null) {
    if (type === 'expenses') return 'Расход'
    if (type === 'profits') return 'Приход'
    if (type === 'transfers') return 'Перевод'

    return 'Не указан'
}

function paymentTypeTextType(type?: PaymentType | null) {
    if (type === 'expenses') return 'danger'
    if (type === 'transfers') return 'info'

    return 'success'
}
</script>

<template>
    <div class="h-full min-h-0">
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
            @row-dblclick="handleOpenEditPayment"
        >
            <ElTableColumn show-overflow-tooltip width="100" prop="payment_date" label="Дата" />
            <ElTableColumn show-overflow-tooltip prop="purpose_title" label="Название" />
            <ElTableColumn show-overflow-tooltip prop="project_title" label="Проект" />
            <ElTableColumn show-overflow-tooltip prop="category_title" label="Категория" />
            <ElTableColumn show-overflow-tooltip prop="note" label="Примечание" />
            <ElTableColumn prop="type" label="Тип">
                <template #default="{ row }">
                    <ElText :type="paymentTypeTextType(row.type)">
                        {{ formatedTypeName(row.type) }}
                    </ElText>
                </template>
            </ElTableColumn>
            <ElTableColumn label="Сумма/Баланс">
                <template #default="{ row }">
                    <span>{{ row.type === 'transfers' && row.to_amount !== null && row.to_amount !== undefined ? row.to_amount : row.amount }} {{ row.account_currency === 'RUB' ? '₽' : '$' }}</span>
                </template>
            </ElTableColumn>
            <template #append>
                <div
                    v-if="isAllPayments"
                    ref="target"
                    class="h-px"
                />
                <div
                    v-if="isRemoteFilter"
                    ref="remoteTarget"
                    class="h-px"
                />
                <div
                    v-if="(isAllPayments && isFetchingNextPage) || (isRemoteFilter && isFetchingRemoteNextPage)"
                    class="py-2 text-center text-sm text-gray-500"
                >
                    Загрузка...
                </div>
            </template>
        </ElTable>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import EditPaymentDialog from '@/pages/transactions/payments/ui/EditPaymentDialog.vue'
import { filterRowsBySearch } from '@/shared/lib/search'
import { useHeaderSearchStore } from '@/shared/store/header-search.store'
import {
    usePaymentsFilteredByAccountInfiniteScrollQuery,
    usePaymentsFilteredByCategoryInfiniteScrollQuery,
    usePaymentsFilteredByGroupInfiniteScrollQuery,
    usePaymentsFilteredByProjectInfiniteScrollQuery,
    usePaymentsFilteredByPurposeInfiniteScrollQuery,
    usePaymentsInfiniteScrollQuery,
    usePaymentsQuery,
} from '@/entities/transaction/payments'
import { useAccountsQuery } from '@/entities/transaction/invoices'
import type { PaymentListItemResponse, PaymentType } from '@/entities/transaction/payments/types/payments.types'
import type { PaymentsFilter } from '@/pages/transactions/payments/payments-filter'

const props = defineProps<{
    filter: PaymentsFilter
}>()

const emit = defineEmits<{
    select: [payment: PaymentListItemResponse]
}>()

const headerSearchStore = useHeaderSearchStore()
const isMobile = useMediaQuery('(max-width: 768px)')
const isAllPayments = computed(() => props.filter.type === 'all')
const isSelectionFilter = computed(() => props.filter.type === 'selection')
const isRemoteFilter = computed(() => isPaymentRemoteFilter(props.filter))
const isAccountFilter = computed(() => props.filter.type === 'account')
const isGroupFilter = computed(() => props.filter.type === 'group')
const isPurposeFilter = computed(() => props.filter.type === 'purpose')
const isProjectFilter = computed(() => props.filter.type === 'project')
const isCategoryFilter = computed(() => props.filter.type === 'category')
const accountFilterId = computed(() => props.filter.type === 'account' ? props.filter.accountId : 0)
const groupFilterId = computed(() => props.filter.type === 'group' ? props.filter.groupId : 0)
const purposeFilterId = computed(() => props.filter.type === 'purpose' ? props.filter.purposeId : 0)
const projectFilterId = computed(() => props.filter.type === 'project' ? props.filter.projectId : 0)
const categoryFilterId = computed(() => props.filter.type === 'category' ? props.filter.categoryId : 0)
const shouldLoadAllPayments = computed(() => isSelectionFilter.value || (isAllPayments.value && Boolean(headerSearchStore.debouncedQuery)))

const {
    data: allPaymentsData,
    target,
    isLoading: isAllPaymentsLoading,
    isFetchingNextPage,
} = usePaymentsInfiniteScrollQuery(30, isAllPayments)

const {
    data: accountPaymentsData,
    target: accountTarget,
    isLoading: isAccountPaymentsLoading,
    isFetchingNextPage: isFetchingAccountNextPage,
} = usePaymentsFilteredByAccountInfiniteScrollQuery(accountFilterId, 30, isAccountFilter)

const {
    data: groupPaymentsData,
    target: groupTarget,
    isLoading: isGroupPaymentsLoading,
    isFetchingNextPage: isFetchingGroupNextPage,
} = usePaymentsFilteredByGroupInfiniteScrollQuery(groupFilterId, 30, isGroupFilter)

const {
    data: purposePaymentsData,
    target: purposeTarget,
    isLoading: isPurposePaymentsLoading,
    isFetchingNextPage: isFetchingPurposeNextPage,
} = usePaymentsFilteredByPurposeInfiniteScrollQuery(purposeFilterId, 30, isPurposeFilter)

const {
    data: projectPaymentsData,
    target: projectTarget,
    isLoading: isProjectPaymentsLoading,
    isFetchingNextPage: isFetchingProjectNextPage,
} = usePaymentsFilteredByProjectInfiniteScrollQuery(projectFilterId, 30, isProjectFilter)

const {
    data: categoryPaymentsData,
    target: categoryTarget,
    isLoading: isCategoryPaymentsLoading,
    isFetchingNextPage: isFetchingCategoryNextPage,
} = usePaymentsFilteredByCategoryInfiniteScrollQuery(categoryFilterId, 30, isCategoryFilter)

const allPaymentsSearchQuery = usePaymentsQuery(shouldLoadAllPayments)
const { data: accounts } = useAccountsQuery(true, isSelectionFilter)

const selectedPayment = ref<PaymentListItemResponse | null>(null)
const isOpenEdit = ref(false)

const tableData = computed(() => {
    if (props.filter.type === 'account') return accountPaymentsData.value?.pages.flat() ?? []
    if (props.filter.type === 'group') return groupPaymentsData.value?.pages.flat() ?? []
    if (props.filter.type === 'purpose') return purposePaymentsData.value?.pages.flat() ?? []
    if (props.filter.type === 'project') return projectPaymentsData.value?.pages.flat() ?? []
    if (props.filter.type === 'category') return categoryPaymentsData.value?.pages.flat() ?? []
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
    if (props.filter.type === 'account') return isAccountPaymentsLoading.value
    if (props.filter.type === 'group') return isGroupPaymentsLoading.value
    if (props.filter.type === 'purpose') return isPurposePaymentsLoading.value
    if (props.filter.type === 'project') return isProjectPaymentsLoading.value
    if (props.filter.type === 'category') return isCategoryPaymentsLoading.value
    if (shouldLoadAllPayments.value && allPaymentsSearchQuery.isLoading.value) return true

    return isAllPaymentsLoading.value
})

const isFetchingRemoteNextPage = computed(() => (
    isFetchingAccountNextPage.value
    || isFetchingGroupNextPage.value
    || isFetchingPurposeNextPage.value
    || isFetchingProjectNextPage.value
    || isFetchingCategoryNextPage.value
))

function isPaymentRemoteFilter(filter: PaymentsFilter): filter is Exclude<PaymentsFilter, { type: 'all' } | { type: 'selection' }> {
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

function paymentTitle(payment: PaymentListItemResponse) {
    return payment.purpose_title || payment.project_title || payment.category_title || payment.note || payment.number || formatedTypeName(payment.type)
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

        <div
            v-if="isMobile"
            v-loading="isLoading"
            class="payments-mobile-list"
        >
            <button
                v-for="payment in filteredTableData"
                :key="payment.id"
                type="button"
                class="payments-mobile-card"
                @click="handleRowClick(payment)"
                @dblclick="handleOpenEditPayment(payment)"
            >
                <span class="payments-mobile-card__top">
                    <span class="payments-mobile-card__date">{{ payment.payment_date || '-' }}</span>
                    <ElText :type="paymentTypeTextType(payment.type)">
                        {{ formatedTypeName(payment.type) }}
                    </ElText>
                </span>
                <strong>{{ paymentTitle(payment) }}</strong>
                <span class="payments-mobile-card__meta">
                    <span>{{ payment.account_title || payment.to_account_title || 'Счет не задан' }}</span>
                    <span>{{ payment.type === 'transfers' && payment.to_amount !== null && payment.to_amount !== undefined ? payment.to_amount : payment.amount }} {{ payment.account_currency === 'RUB' ? '₽' : '$' }}</span>
                </span>
                <span
                    v-if="payment.note"
                    class="payments-mobile-card__note"
                >
                    {{ payment.note }}
                </span>
            </button>

            <div
                v-if="isAllPayments"
                ref="target"
                class="h-px"
            />
            <div
                v-if="isAccountFilter"
                ref="accountTarget"
                class="h-px"
            />
            <div
                v-if="isGroupFilter"
                ref="groupTarget"
                class="h-px"
            />
            <div
                v-if="isPurposeFilter"
                ref="purposeTarget"
                class="h-px"
            />
            <div
                v-if="isProjectFilter"
                ref="projectTarget"
                class="h-px"
            />
            <div
                v-if="isCategoryFilter"
                ref="categoryTarget"
                class="h-px"
            />
            <div
                v-if="(isAllPayments && isFetchingNextPage) || (isRemoteFilter && isFetchingRemoteNextPage)"
                class="py-2 text-center text-sm text-gray-500"
            >
                Загрузка...
            </div>
        </div>

        <ElTable
            v-else
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
                    v-if="isAccountFilter"
                    ref="accountTarget"
                    class="h-px"
                />
                <div
                    v-if="isGroupFilter"
                    ref="groupTarget"
                    class="h-px"
                />
                <div
                    v-if="isPurposeFilter"
                    ref="purposeTarget"
                    class="h-px"
                />
                <div
                    v-if="isProjectFilter"
                    ref="projectTarget"
                    class="h-px"
                />
                <div
                    v-if="isCategoryFilter"
                    ref="categoryTarget"
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

<style scoped>
.payments-mobile-list {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding: 10px;
  background: #f4f7f9;
}

.payments-mobile-card {
  display: flex;
  width: 100%;
  flex-direction: column;
  border: 1px solid #dfe6ee;
  border-radius: 8px;
  background: #fff;
  padding: 12px;
  color: #1f2937;
  text-align: left;
  gap: 8px;
  box-shadow: 0 6px 18px rgb(15 23 42 / 6%);
}

.payments-mobile-card__top,
.payments-mobile-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.payments-mobile-card__date,
.payments-mobile-card__note {
  overflow: hidden;
  color: #6b7280;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.payments-mobile-card strong {
  overflow: hidden;
  font-size: 15px;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.payments-mobile-card__meta {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.payments-mobile-card__meta span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

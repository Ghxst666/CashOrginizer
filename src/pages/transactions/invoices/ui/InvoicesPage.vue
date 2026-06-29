<script setup lang="ts">
import InvoicesTable from '@/entities/Invoices/InvoicesTable.vue';
import InvoicesHeader from './InvoicesHeader.vue';
import { computed, ref } from 'vue';
import NewInvoicesDialog from '@/shared/ui/NewInvoicesDialog.vue';
import InvoicuesEditDialog from '@/shared/ui/edit/InvoicuesEditDialog.vue';
import { useAccountsQuery, useAccountsReorder, useAccountsSummaryQuery, useFilteredInvoicesByGroups, useFilteredInvoicesByType } from '@/entities/transaction/invoices/index.ts';
import { accountEditRequesData, accountsResponse, accountsSortedByGroupsResponse, accountsSortedByTypeResponse } from '@/entities/transaction/invoices/types/invoices.types.ts';
import InvoicesTypeGroupesTable from '@/entities/Invoices/InvoicesTypeGroupesTable.vue';
import SidePropertiesPanel from '@/shared/ui/SidePropertiesPanel.vue';
import { GroupsContainer } from '@/features/groups';
import { useRouter } from 'vue-router';
import { TRANSACTION_ROUTE } from '@/shared/router';
import type { InvoicesAccountsFilter } from '../invoices-filter';
import { filterRowsBySearch, matchesSearch } from '@/shared/lib/search';
import { useHeaderSearchStore } from '@/shared/store/header-search.store';
import TransactionBalanceBar from '@/shared/ui/TransactionBalanceBar.vue'

type AccountsGroup = accountsSortedByTypeResponse | accountsSortedByGroupsResponse

const isOpen = ref<boolean>(false)
const router = useRouter()
const headerSearchStore = useHeaderSearchStore()
const selectedId = ref<number | null>(null)
const updateDialogVisible = ref<boolean>(false)
const isPropertiesOpen = ref(false)
const isGroupSettingsOpen = ref(false)
const selectedAccount = ref<accountsResponse | null>(null)
const showClosedAccounts = ref(false)
const selectedAccountsFilter = ref<InvoicesAccountsFilter>({ type: 'all' })
const accountsStatus = computed(() => !showClosedAccounts.value)
const tableMode = ref<'default' | 'type' | 'group'>('default')
const isTypeSort = computed(() => tableMode.value === 'type')
const isGroupSort = computed(() => tableMode.value === 'group')
const isDefaultTable = computed(() => tableMode.value === 'default')

const { data: accountsData, refetch: refetchAccounts } = useAccountsQuery(accountsStatus, isDefaultTable)
const { data: accountsSummary } = useAccountsSummaryQuery(true)
const { data: accountsByTypeData } = useFilteredInvoicesByType(accountsStatus, isTypeSort)
const { data: accountsByGroupsData } = useFilteredInvoicesByGroups(accountsStatus, isGroupSort)
const { mutateAsync: reorderAccounts } = useAccountsReorder()
const invoicesTableData = computed(() => {
  return accountsData.value ?? []
})
const filteredInvoicesTableData = computed(() => filterAccounts(invoicesTableData.value))
const filteredAccountsByTypeData = computed(() => filterAccountGroups(accountsByTypeData.value ?? []))
const filteredAccountsByGroupsData = computed(() => filterAccountGroups(accountsByGroupsData.value ?? []))
const totalBalance = computed(() => amountToNumber(accountsSummary.value?.total_amount))

const formData = ref<accountEditRequesData>({
  title: '',
  type: '',
  start_amount: 0,
  min_amount: 0,
  credit_limit_amount: 0,
  note: '',
  status: true,
  group_id: 0,
  currency: 'RUB',
  exchange_rate: null,
})

function handleSortByType() {
  tableMode.value = 'type'
}

function handleSortDefault() {
  tableMode.value = 'default'
}

function handleSortByGroups() {
  tableMode.value = 'group'
}

function handleOpenDialog() {
  isOpen.value = true
}

function handleShowProperties() {
  isPropertiesOpen.value = true
}

function handleShowGroupSettings() {
  isGroupSettingsOpen.value = true
}

function handleShowCloseAccount() {
  showClosedAccounts.value = !showClosedAccounts.value
}

function handleSelectAccountsFilter(filter: InvoicesAccountsFilter) {
  selectedAccountsFilter.value = filter
  tableMode.value = 'default'
}

function handleSelectAccount(row: accountsResponse) {
  selectedAccount.value = row
}

function handleOpenPayments(row: accountsResponse) {
  router.push({
    name: TRANSACTION_ROUTE.PAYMENTS.NAME,
    query: {
      account_id: String(row.id),
      account_title: row.title,
    },
  })
}

function handleOpenUpdateDialog(row: accountsResponse) {
  selectedId.value = row.id
  formData.value = {
    title: row.title,
    type: row.type,
    start_amount: Number(row.start_amount) || 0,
    min_amount: Number(row.min_amount) || 0,
    credit_limit_amount: Number(row.credit_limit_amount) || 0,
    note: row.note,
    status: row.status,
    group_id: row.group_id,
    currency: row.currency || 'RUB',
    exchange_rate: row.exchange_rate === null || row.exchange_rate === undefined
      ? null
      : Number(row.exchange_rate),
  }
  updateDialogVisible.value = true
}

async function handleReorder(nextOrder: number[]) {
  const currentOrder = invoicesTableData.value.map(account => account.id)
  const hasSameAccounts = nextOrder.length === currentOrder.length
    && nextOrder.every(accountId => currentOrder.includes(accountId))

  if (!hasSameAccounts || nextOrder.every((accountId, index) => accountId === currentOrder[index])) {
    await refetchAccounts()
    return
  }

  try {
    await reorderAccounts({ account_ids: nextOrder })
  } catch {
    // Mutation handlers show user-facing errors.
  } finally {
    await refetchAccounts()
  }
}

function mapperStatus(status: boolean) {
  if (status === true) {
    return "Открытый"
  } else {
    return "Закрытый"
  }
}
function getAccountSearchValues(account: accountsResponse) {
  return [
    account.title,
    account.type,
    account.amount,
    account.note,
    account.start_amount,
    account.min_amount,
    account.credit_limit_amount,
    account.currency,
    mapperStatus(account.status),
  ]
}

function filterAccounts(accounts: accountsResponse[]) {
  return filterRowsBySearch(
    accounts.filter(matchesSelectedAccounts),
    headerSearchStore.debouncedQuery,
    getAccountSearchValues,
  )
}

function matchesSelectedAccounts(account: accountsResponse) {
  if (selectedAccountsFilter.value.type === 'all') return true

  return selectedAccountsFilter.value.accountIds.includes(account.id)
    || (account.group_id !== null && selectedAccountsFilter.value.groupIds.includes(account.group_id))
}

function filterAccountGroups(groups: AccountsGroup[]) {
  return groups.flatMap((group) => {
    const accounts = filterAccounts(group.accounts)
    const groupMatchesSearch = matchesSearch(headerSearchStore.debouncedQuery, [group.title])

    return accounts.length > 0 && (groupMatchesSearch || accounts.length > 0)
      ? [{ ...group, accounts }]
      : []
  })
}

function amountToNumber(amount?: string | number | null) {
  const parsedAmount = Number(String(amount ?? 0).replace(/\s/g, '').replace(',', '.'))

  return Number.isFinite(parsedAmount) ? parsedAmount : 0
}

</script>

<template>
  <NewInvoicesDialog
    v-model="isOpen"
    title="Новый счет"
  />

  <div class="h-full flex">
    <div class="flex-1 min-w-0 flex flex-col">
      <InvoicesHeader
        :active-sort="tableMode"
        :show-closed-accounts="showClosedAccounts"
        :selected-filter="selectedAccountsFilter"
        @new-invoice="handleOpenDialog"
        @select-filter="handleSelectAccountsFilter"
        @sort-by-type="handleSortByType"
        @sort-default="handleSortDefault"
        @show-properties="handleShowProperties"
        @show-group-settings="handleShowGroupSettings"
        @show-close-accounts="handleShowCloseAccount"
        @sort-group="handleSortByGroups"
      />

      <InvoicesTypeGroupesTable
        v-if="tableMode === 'type'"
        class="flex-1 min-h-0"
        :data="filteredAccountsByTypeData"
        @edit="handleOpenUpdateDialog"
        @select="handleSelectAccount"
      />
      <InvoicesTypeGroupesTable
        v-else-if="tableMode === 'group'"
        class="flex-1 min-h-0"
        :data="filteredAccountsByGroupsData"
        @edit="handleOpenUpdateDialog"
        @select="handleSelectAccount"
      />
      <InvoicesTable
        v-else
        class="flex-1 min-h-0"
        :data="filteredInvoicesTableData"
        :reorderable="true"
        @edit="handleOpenUpdateDialog"
        @select="handleSelectAccount"
        @open-payments="handleOpenPayments"
        @reorder="handleReorder"
      />

      <TransactionBalanceBar
        :balance="totalBalance"
        :show-operations="false"
      />

      <InvoicuesEditDialog
        v-model="updateDialogVisible"
        title="Редактировать счет"
        :id="selectedId"
        :update-data="formData"
      />
    </div>

    <SidePropertiesPanel
      v-model="isPropertiesOpen"
      title="Свойства счета"
      width="400px"
    >
      <template v-if="selectedAccount">
        <ElForm
          :model="selectedAccount"
          label-position="top"
          class="account-form"
        >
          <ElFormItem label="Название">
            <span class="text-[#6b7280]">{{ selectedAccount.title }}</span>
          </ElFormItem>
          <ElFormItem label="Тип">
            <span class="text-[#6b7280]">{{ selectedAccount.type }}</span>
          </ElFormItem>
          <ElFormItem label="Общий баланс">
            <span class="text-[#6b7280]">{{ selectedAccount.amount }}</span>
          </ElFormItem>
          <ElFormItem label="Валюта">
            <span class="text-[#6b7280]">{{ selectedAccount.currency }}</span>
          </ElFormItem>
          <ElFormItem label="Примечание">
            <span class="text-[#6b7280]">
              {{ selectedAccount.note || '—' }}
            </span>
          </ElFormItem>
          <ElFormItem label="Состояние">
            <span class="text-[#6b7280]">{{ mapperStatus(selectedAccount.status) }}</span>
          </ElFormItem>
        </ElForm>
      </template>

      <template v-else>
        <div class="h-full flex items-center justify-center text-[#9ca3af] text-sm">
          Выбери счет в таблице, чтобы посмотреть свойства
        </div>
      </template>
    </SidePropertiesPanel>

    <GroupsContainer v-model="isGroupSettingsOpen" />
  </div>
</template>

<style scoped>
:deep(.account-form .el-form-item__label) {
  color: #000;
  font-size: 16px;
}
</style>

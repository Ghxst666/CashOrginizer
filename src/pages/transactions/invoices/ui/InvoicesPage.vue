<script setup lang="ts">
import InvoicesTable from '@/entities/Invoices/InvoicesTable.vue';
import InvoicesHeader from './InvoicesHeader.vue';
import { computed, ref } from 'vue';
import NewInvoicesDialog from '@/shared/ui/NewInvoicesDialog.vue';
import InvoicuesEditDialog from '@/shared/ui/edit/InvoicuesEditDialog.vue';
import { useAccountsQuery, useDelete, useFilteredInvoicesByGroups, useFilteredInvoicesByType } from '@/entities/transaction/invoices/index.ts';
import { accountsCreateRequest, accountsResponse } from '@/entities/transaction/invoices/types/invoices.types.ts';
import InvoicesTypeGroupesTable from '@/entities/Invoices/InvoicesTypeGroupesTable.vue';
import SidePropertiesPanel from '@/shared/ui/SidePropertiesPanel.vue';
import { GroupsContainer } from '@/features/groups';

const isOpen = ref<boolean>(false)
const selectedId = ref<number | null>(null)
const updateDialogVisible = ref<boolean>(false)
const isPropertiesOpen = ref(false)
const isGroupSettingsOpen = ref(false)
const selectedAccount = ref<accountsResponse | null>(null)
const showClosedAccounts = ref(false)
const accountsStatus = computed(() => !showClosedAccounts.value)
const tableMode = ref<'default' | 'type' | 'group'>('default')
const isDefaultSort = computed(() => tableMode.value === 'default')
const isTypeSort = computed(() => tableMode.value === 'type')
const isGroupSort = computed(() => tableMode.value === 'group')

const { data: accountsData } = useAccountsQuery(accountsStatus, isDefaultSort)
const { data: accountsByTypeData } = useFilteredInvoicesByType(accountsStatus, isTypeSort)
const { data: accountsByGroupsData } = useFilteredInvoicesByGroups(accountsStatus, isGroupSort)
const { mutate: deleteAccount } = useDelete()

const formData = ref<accountsCreateRequest>({
  title: '',
  type: '',
  start_amount: 0,
  min_amount: 0,
  credit_limit_amount: 0,
  note: '',
  status: true,
  group_id: 0,
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

function handleSelectAccount(row: accountsResponse) {
  selectedAccount.value = row
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
  }
  updateDialogVisible.value = true
}

function handleDelete(accountId: number) {
  deleteAccount({ account_id: accountId })
}

function mapperStatus(status: boolean) {
  if (status === true) {
    return "Открытый"
  } else {
    return "Закрытый"
  }
}
</script>

<template>
  <NewInvoicesDialog
    v-model="isOpen"
    title="Новый счет"
  />

  <div class="h-full flex">
    <div class="flex-1 min-w-0">
      <InvoicesHeader
        :active-sort="tableMode"
        :show-closed-accounts="showClosedAccounts"
        @new-invoice="handleOpenDialog"
        @sort-by-type="handleSortByType"
        @sort-default="handleSortDefault"
        @show-properties="handleShowProperties"
        @show-group-settings="handleShowGroupSettings"
        @show-close-accounts="handleShowCloseAccount"
        @sort-group="handleSortByGroups"
      />

      <InvoicesTypeGroupesTable
        v-if="tableMode === 'type'"
        :data="accountsByTypeData ?? []"
        @delete="handleDelete"
        @edit="handleOpenUpdateDialog"
        @select="handleSelectAccount"
      />
      <InvoicesTypeGroupesTable
        v-else-if="tableMode === 'group'"
        :data="accountsByGroupsData ?? []"
        @delete="handleDelete"
        @edit="handleOpenUpdateDialog"
        @select="handleSelectAccount"
      />
      <InvoicesTable
        v-else
        :data="accountsData ?? []"
        @delete="handleDelete"
        @edit="handleOpenUpdateDialog"
        @select="handleSelectAccount"
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
            <span class="text-[#6b7280]">RUB</span>
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

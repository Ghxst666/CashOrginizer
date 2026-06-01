<script setup lang="ts">
import InvoicesTable from '@/entities/Invoices/InvoicesTable.vue';
import InvoicesHeader from './InvoicesHeader.vue';
import { ref } from 'vue';
import NewInvoicesDialog from '@/shared/ui/NewInvoicesDialog.vue';
import InvoicuesEditDialog from '@/shared/ui/edit/InvoicuesEditDialog.vue';
import { useAccountsQuery, useDelete } from '@/entities/transaction/invoices/index.ts';
import { accountsCreateRequest, accountsResponse } from '@/entities/transaction/invoices/types/invoices.types.ts';
import InvoicesTypeGroupesTable from '@/entities/Invoices/InvoicesTypeGroupesTable.vue';
import SidePropertiesPanel from '@/shared/ui/SidePropertiesPanel.vue';

const isOpen = ref<boolean>(false)
const selectedId = ref<number | null>(null)
const updateDialogVisible = ref<boolean>(false)
const isPropertiesOpen = ref(false)
const selectedAccount = ref<accountsResponse | null>(null)

const { data } = useAccountsQuery()
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

const tableMode = ref<'default' | 'type'>('default')

function handleSortByType() {
  tableMode.value = 'type'
}

function handleSortDefault() {
  tableMode.value = 'default'
}

function handleOpenDialog() {
  isOpen.value = true
}

function handleShowProperties() {
  isPropertiesOpen.value = true
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

function handleDelete (accountId: number) {
  deleteAccount({ account_id: accountId })
}
</script>

<template>
  <div class="h-full flex">
    <div class="flex-1 min-w-0">
      <InvoicesHeader
        @new-invoice="handleOpenDialog"
        @sort-by-type="handleSortByType"
        @sort-default="handleSortDefault"
        @show-properties="handleShowProperties"
      />

      <InvoicesTypeGroupesTable v-if="tableMode === 'type'" />
      <InvoicesTable
        v-else
        :data="data ?? []"
        @delete="handleDelete"
        @edit="handleOpenUpdateDialog"
        @select="handleSelectAccount"
      />
    </div>

    <SidePropertiesPanel v-model="isPropertiesOpen" title="Свойства счета" width="500px">
      <template v-if="selectedAccount">
        <div class="grid gap-3">
          <span class="text-[#6b7280]">Название: {{ selectedAccount.title }}</span> 
          <span class="text-[#6b7280]">Тип: {{ selectedAccount.type }}</span> 
          <span class="text-[#6b7280]">Общий баланс: {{ selectedAccount.amount }}</span> 
          <span class="text-[#6b7280]">Валюта: ₽</span> 
          <span class="text-[#6b7280]">Примечание:  {{ selectedAccount.note || '—' }}</span>
        </div>
      </template>

      <template v-else>
        <div class="h-full flex items-center justify-center text-[#9ca3af] text-sm">
          Выбери счет в таблице, чтобы посмотреть свойства
        </div>
      </template>
    </SidePropertiesPanel>
  </div>
</template>


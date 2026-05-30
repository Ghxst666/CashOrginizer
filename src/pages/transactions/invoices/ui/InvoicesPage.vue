<script setup lang="ts">
import InvoicesTable from '@/entities/Invoices/InvoicesTable.vue';
import InvoicesHeader from './InvoicesHeader.vue';
import { ref } from 'vue';
import NewInvoicesDialog from '@/shared/ui/NewInvoicesDialog.vue';
import InvoicuesEditDialog from '@/shared/ui/edit/InvoicuesEditDialog.vue';
import { useAccountsQuery } from '@/entities/transaction/invoices/index.ts';

const isOpen = ref<boolean>(false)
const updateDialogVisible = ref<boolean>(false)

const { data } = useAccountsQuery()

const formData = ref({
  name: '',
  type: '',
  nach_balance: '',
  min_balance: '',
  note: '',
  invoicesGroup: '',
})

function handleOpenDialog() {
  isOpen.value = true
}

function handleOpenUpdateDialog() {
  updateDialogVisible.value = true
}

function handleCloseDialog() {
  isOpen.value = false
  formData.value = {
    name: '',
    type: '',
    nach_balance: '',
    min_balance: '',
    note: '',
    invoicesGroup: '',
  }
}

function handleClosUpdateDialog() {
  updateDialogVisible.value = false
}

function handleDelete() {
  console.log('удалить')
}
</script>

<template>
  <InvoicuesEditDialog 
    v-model:new-pay="updateDialogVisible"
    v-model="formData"
    title="Редактирование счета"
    :name="formData.name"
    :type="formData.type"
    :nach_balance="formData.nach_balance"
    :min_balance="formData.min_balance"
    :note="formData.note"
    :invoicesGroup="formData.invoicesGroup"
    @close="handleClosUpdateDialog"
  />
  <NewInvoicesDialog
      v-model="isOpen"
      title="Новый счет"
      @close="handleCloseDialog"
  />
  <div class="h-full">
    <InvoicesHeader @new-invoice="handleOpenDialog" />
    <InvoicesTable :data="data ?? []" @delete="handleDelete" @edit="handleOpenUpdateDialog" />
  </div>
</template>


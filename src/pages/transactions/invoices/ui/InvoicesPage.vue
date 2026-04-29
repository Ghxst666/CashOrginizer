<script setup lang="ts">
import InvoicesTable from '@/entities/Invoices/InvoicesTable.vue';
import InvoicesHeader from './InvoicesHeader.vue';
import { ref } from 'vue';
import NewInvoicesDialog from '@/shared/ui/NewInvoicesDialog.vue';
import InvoicuesEditDialog from '@/shared/ui/edit/InvoicuesEditDialog.vue';

const newPayDialogVisible = ref<boolean>(false)
const updateDialogVisible = ref<boolean>(false)

const formData = ref({
  name: '',
  type: '',
  nach_balance: '',
  min_balance: '',
  note: '',
  invoicesGroup: '',
})

function handleOpenDialog() {
  newPayDialogVisible.value = true
}

function handleOpenUpdateDialog() {
  updateDialogVisible.value = true
}

function handleCloseDialog() {
  newPayDialogVisible.value = false
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
    v-model:new-pay="newPayDialogVisible"
    title="Новый счет"
    @close="handleCloseDialog"
  >
      <ElScrollbar height="400px">
        <ElForm :model="formData" label-position="top" class="payment-form">
          <ElFormItem label="Название">
            <ElInput v-model="formData.name" />
          </ElFormItem>

          <ElFormItem label="Тип">
            <ElSelect v-model="formData.type">
              <ElOption label="Банк" value="type 1" />
              <ElOption label="Наличные" value="type 2" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Начальный баланс">
            <ElInput v-model="formData.nach_balance" />
          </ElFormItem>

          <ElFormItem label="Минимальный баланс">
            <ElInput v-model="formData.min_balance" />
          </ElFormItem>

          <ElFormItem label="Примечание">
            <ElInput v-model="formData.note" />
          </ElFormItem>

          <ElFormItem label="Группа счетов">
            <ElSelect v-model="formData.invoicesGroup">
              <ElOption label="Группа 1" value="invoicesGroup 1" />
              <ElOption label="Группа 2" value="invoicesGroup 2" />
            </ElSelect>
          </ElFormItem>
        </ElForm>
      </ElScrollbar>
  </NewInvoicesDialog>
  <div class="h-full">
    <InvoicesHeader @new-invoice="handleOpenDialog" />
    <InvoicesTable @delete="handleDelete" @edit="handleOpenUpdateDialog" />
  </div>
</template>

<style scoped>
.payment-form {
  padding: 16px;
  border-radius: 12px;
  background: #eef3f4;

  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 8px 24px rgba(0, 0, 0, 0.04);
}

.payment-form :deep(.el-form-item__label) {
  font-weight: 700;
  color: #2f3a3d;
  margin-bottom: 6px;
}

.payment-form :deep(.el-input__wrapper),
.payment-form :deep(.el-select__wrapper),
.payment-form :deep(.el-date-editor.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(120, 140, 145, 0.18) inset;
}
</style>

<script setup lang="ts">
import { useAccountsEdit, useDelete } from '@/entities/transaction/invoices';
import { accountsCreateRequest } from '@/entities/transaction/invoices/types/invoices.types';
import { ElDialog } from 'element-plus';
import { computed, ref, watch } from 'vue';
const props = defineProps<{
  title: string
  id: number | null
  updateData: accountsCreateRequest
}>()

const isOpen = defineModel<boolean>({ default: false })
const { mutate, isPending } = useAccountsEdit()
const { mutate: deleteAccount, isPending: isDeleting } = useDelete()

const formData  = ref<accountsCreateRequest>({
  title: '',
  type: '',
  start_amount: 0,
  min_amount: 0,
  credit_limit_amount: 0,
  note: '',
  status: true,
  group_id: 0,
})

const disabled = computed(() => isPending.value)

watch(
  () => props.updateData,
  (val) => { if (val) formData .value = { ...val } },
  { immediate: true }
)

function handleUpdate() {
  if (!props.id) return

  const payload: any = { ...formData.value }

  if (payload.type !== 'creditcard') {
    delete payload.credit_limit_amount
  } else {
    payload.credit_limit_amount = Number(payload.credit_limit_amount) || 0
  }

  mutate(
    {
      account_id: props.id,
      data: payload,
    },
    {
      onSuccess: () => {
        isOpen.value = false
      },
    }
  )
}

function handleDelete() {
  if (!props.id) return

  deleteAccount(
    { account_id: props.id },
    {
      onSuccess: () => {
        isOpen.value = false
      },
    },
  )
}
</script>

<template>
  <ElDialog :title="props.title" v-model="isOpen" width="800">
    <ElScrollbar height="400px">
      <div class="account-editor-layout">
      <ElForm :model="formData" label-position="top" class="payment-form">
        <ElFormItem label="Название">
          <ElInput v-model="formData.title" />
        </ElFormItem>

        <ElFormItem label="Тип">
          <ElSelect v-model="formData.type">
            <ElOption label="Банк" value="bank" />
            <ElOption label="Наличные" value="cash" />
            <ElOption label="Имущество" value="property" />
            <ElOption label="Кредитная карта" value="creditcard" />
            <ElOption label="Дебетовая карта" value="debitcard" />
            <ElOption label="Инвестиции" value="investments" />
            <ElOption label="Долг" value="debt" />
            <ElOption label="Займ" value="loan" />
            <ElOption label="Дебиторский" value="receivable" />
            <ElOption label="Налоговый" value="tax" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="Начальный баланс">
          <ElInput v-model="formData.start_amount" />
        </ElFormItem>

        <ElFormItem label="Минимальный баланс">
          <ElInput v-model="formData.min_amount" />
        </ElFormItem>

        <ElFormItem v-if="formData.type === 'creditcard'" label="Кредитный лимит">
          <ElInput v-model="formData.credit_limit_amount" />
        </ElFormItem>

        <ElFormItem label="Примечание">
          <ElInput v-model="formData.note" />
        </ElFormItem>

        <ElFormItem label="Статус">
          <ElSelect v-model="formData.status">
            <ElOption label="Открытый" :value="true" />
            <ElOption label="Закрытый" :value="false" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="Группа счетов">
          <ElSelect v-model="formData.group_id">
            <ElOption label="1" :value="1" />
            <ElOption label="2" :value="2" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <aside class="account-inputs-panel">
        <div class="account-inputs-panel__title">Поля ввода</div>
        <ElInput v-model="formData.title" placeholder="Название" />
        <ElInput v-model="formData.start_amount" placeholder="Начальный баланс" />
        <ElInput v-model="formData.min_amount" placeholder="Минимальный баланс" />
        <ElInput v-if="formData.type === 'creditcard'" v-model="formData.credit_limit_amount" placeholder="Кредитный лимит" />
        <ElInput v-model="formData.note" type="textarea" :rows="5" placeholder="Примечание" />
      </aside>
      </div>
    </ElScrollbar>

    <template #footer>
      <div class="flex justify-between">
        <ElPopconfirm
          width="220"
          :icon="undefined"
          title="Вы хотите удалить счёт?"
          @confirm="handleDelete"
        >
          <template #reference>
            <ElButton type="danger" :loading="isDeleting" :disabled="isPending">Удалить</ElButton>
          </template>
        </ElPopconfirm>
        <ElButton @click="isOpen = false">Отмена</ElButton>
        <ElButton type="primary" @click="handleUpdate" :disabled="disabled">Готово</ElButton>
      </div>
    </template>
  </ElDialog>
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

.account-editor-layout { display: grid; grid-template-columns: minmax(0, 1fr) 270px; gap: 16px; }
.account-inputs-panel { display: flex; flex-direction: column; gap: 10px; border-left: 1px solid #d7dde3; padding-left: 16px; }
.account-inputs-panel__title { color: #374151; font-weight: 700; }
</style>

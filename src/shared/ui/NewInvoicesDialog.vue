<script setup lang="ts">
import { ElDialog } from 'element-plus';
import { accountsCreateRequest } from '@/entities/transaction/invoices/types/invoices.types';
import { useCreateAccount } from '@/entities/transaction/invoices';
import { useGroupsQuery } from '@/entities/transaction/groups';
import { computed, ref, watch } from 'vue';
const props = defineProps<{
    title: string
}>()

const { mutate, isPending, isSuccess } = useCreateAccount()
const isOpen = defineModel<boolean>({ default: false })
const { data: groups, isLoading: isGroupsLoading } = useGroupsQuery(isOpen)

const newAccountFormData = ref<accountsCreateRequest>({
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


function handleCreate() {
    mutate(newAccountFormData.value)
}

function handleCloseDialog() {
  isOpen.value = false
  newAccountFormData.value = {
    title: '',
    type: '',
    start_amount: 0,
    min_amount: 0,
    credit_limit_amount: 0,
    note: '',
    status: true,
    group_id: 0,
  }
}

watch(isSuccess, () => {
  isOpen.value = false
  newAccountFormData.value = {
    title: '',
    type: '',
    start_amount: 0,
    min_amount: 0,
    credit_limit_amount: 0,
    note: '',
    status: true,
    group_id: 0,
  }
})
</script>

<template>
    <ElDialog :title="props.title" v-model="isOpen" width="800">
        <ElScrollbar height="400px">
            <ElForm :model="newAccountFormData" label-position="top" class="payment-form">
                <ElFormItem label="Название">
                    <ElInput v-model="newAccountFormData.title" />
                </ElFormItem>

                <ElFormItem label="Тип">
                    <ElSelect v-model="newAccountFormData.type">
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
                    <ElInput v-model="newAccountFormData.start_amount" />
                </ElFormItem>

                <ElFormItem label="Минимальный баланс">
                    <ElInput v-model="newAccountFormData.min_amount" />
                </ElFormItem>

                <ElFormItem v-if="newAccountFormData.type === 'creditcard'" label="Кредитный лимит">
                    <ElInput v-model="newAccountFormData.credit_limit_amount" />
                </ElFormItem>

                <ElFormItem label="Примечание">
                    <ElInput v-model="newAccountFormData.note" />
                </ElFormItem>

                <ElFormItem label="Статус">
                    <ElSelect v-model="newAccountFormData.status">
                        <ElOption label="Открытый" value="true" />
                        <ElOption label="Закрытый" value="false" />
                    </ElSelect>
                </ElFormItem>

                <ElFormItem label="Группа счетов">
                    <ElSelect
                        v-model="newAccountFormData.group_id"
                        :loading="isGroupsLoading"
                    >
                        <ElOption
                            v-for="group in groups"
                            :key="group.id"
                            :label="group.title"
                            :value="group.id"
                        />
                    </ElSelect>
                </ElFormItem>
            </ElForm>
        </ElScrollbar>
        <template #footer>
            <div class="flex justify-between">
                <ElButton @click="handleCloseDialog">
                    Отмена
                </ElButton>

                <ElButton
                    type="primary"
                    @click="handleCreate"
                    :disabled="disabled"
                >
                    Готово
                </ElButton>
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
</style>

<script setup lang="ts">
import { ElDialog } from 'element-plus';
const props = defineProps<{
    title: string
    name: string
    type: string,
    nach_balance: string,
    min_balance: string,
    note: string,
    invoicesGroup: string,
}>()

const emits = defineEmits<{
    close: []
}>()

const newPayDialogVisible = defineModel<boolean>('newPay', { required: true })
const editData = defineModel()
</script>

<template>
    <ElDialog :title="props.title" v-model="newPayDialogVisible" width="800">
        <ElScrollbar height="400px">
            <ElForm v-model="editData" label-position="top" class="payment-form">
                <ElFormItem label="Название">
                    <ElInput v-model="props.name" />
                </ElFormItem>

                <ElFormItem label="Тип">
                    <ElSelect v-model="props.type">
                    <ElOption label="Банк" value="type 1" />
                    <ElOption label="Наличные" value="type 2" />
                    </ElSelect>
                </ElFormItem>

                <ElFormItem label="Начальный баланс">
                    <ElInput v-model="props.nach_balance" />
                </ElFormItem>

                <ElFormItem label="Минимальный баланс">
                    <ElInput v-model="props.min_balance" />
                </ElFormItem>

                <ElFormItem label="Примечание">
                    <ElInput v-model="props.note" />
                </ElFormItem>

                <ElFormItem label="Группа счетов">
                    <ElSelect v-model="props.invoicesGroup">
                    <ElOption label="Группа 1" value="invoicesGroup 1" />
                    <ElOption label="Группа 2" value="invoicesGroup 2" />
                    </ElSelect>
                </ElFormItem>
            </ElForm>
        </ElScrollbar>
        <template #footer>
            <div class="flex justify-between">
                <ElButton @click="emits('close')">
                    Отмена
                </ElButton>

                <ElButton
                    type="primary"
                    @click="emits('close')"
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
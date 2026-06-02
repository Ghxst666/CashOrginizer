<script setup lang="ts">
import SystemBalanceWidget from '@/widgets/System/SystemBalanceWidget.vue';
import SystemHeader from './SystemHeader.vue';
import SystemPlanningWidget from '@/widgets/System/SystemPlanningWidget.vue';
import SystemBudgetWidget from '@/widgets/System/SystemBudgetWidget.vue';
import SystemExpenses from '@/widgets/System/SystemExpenses.vue';
import { ElDatePicker, ElEmpty, ElForm, ElFormItem, ElInput, ElScrollbar } from 'element-plus';
import NewPayDialog from '@/shared/ui/NewPayDialog.vue';
import { ref } from 'vue';


const newPayDialogVisible = ref<boolean>(false)
const flag = <boolean>(false)

const formData = ref({
  check: '',
  date: '',
  name: '',
  sum: '',
  note: '',
  category: '',
  project: '',
  tag: '',
  metca: '',
  number: '',
})

function handleOpenDialog() {
  newPayDialogVisible.value = true
}

function handleCloseDialog() {
  newPayDialogVisible.value = false
  formData.value = {
    check: '',
    date: '',
    name: '',
    sum: '',
    note: '',
    category: '',
    project: '',
    tag: '',
    metca: '',
    number: '',
  }
}
</script>

<template>
  <NewPayDialog
    v-model:new-pay="newPayDialogVisible"
    title="Новый платеж"
    first-step-title="Свойства"
    second-step-title="Сплит"
    @close="handleCloseDialog"
  >
    <template #step-1>
      <ElScrollbar height="400px">
        <ElForm :model="formData" label-position="top" class="payment-form">
          <ElFormItem label="Счет">
            <ElSelect v-model="formData.check">
              <ElOption label="Счет 1" value="check 1" />
              <ElOption label="Счет 2" value="check 2" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Дата">
            <ElDatePicker v-model="formData.date" />
          </ElFormItem>

          <ElFormItem label="Название">
            <ElInput v-model="formData.name" />
          </ElFormItem>

          <ElFormItem label="Сумма">
            <ElInput v-model="formData.sum" />
          </ElFormItem>

          <ElFormItem label="Примечание">
            <ElInput v-model="formData.note" />
          </ElFormItem>

          <ElFormItem label="Категория">
            <ElSelect v-model="formData.category">
              <ElOption label="Категория 1" value="category 1" />
              <ElOption label="Категория 2" value="category 2" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Проект">
            <ElSelect v-model="formData.project">
              <ElOption label="Проект 1" value="project 1" />
              <ElOption label="Проект 2" value="project 2" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Тег">
            <ElSelect v-model="formData.tag">
              <ElOption label="Тег 1" value="tag 1" />
              <ElOption label="Тег 2" value="tag 2" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Метка">
            <ElSelect v-model="formData.metca">
              <ElOption label="Несогласованный" value="metca 1" />
              <ElOption label="Чистый" value="metca 2" />
              <ElOption label="Согласованный" value="metca 3" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Номер">
            <ElInput v-model="formData.number" />
          </ElFormItem>
        </ElForm>
      </ElScrollbar>
    </template>

    <template #step-2>
      <ElScrollbar height="400px">
        <ElForm :model="formData" label-position="top" class="payment-form">
          <ElFormItem label="Примечание">
            <ElInput v-model="formData.note" />
          </ElFormItem>

          <ElFormItem label="Сумма">
            <ElInput v-model="formData.sum" />
          </ElFormItem>

          <ElFormItem label="Категория">
            <ElSelect v-model="formData.category">
              <ElOption label="Категория 1" value="category 1" />
              <ElOption label="Категория 2" value="category 2" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Проект">
            <ElSelect v-model="formData.project">
              <ElOption label="Проект 1" value="project 1" />
              <ElOption label="Проект 2" value="project 2" />
            </ElSelect>
          </ElFormItem>
        </ElForm>
        <div class="flex justify-center">
          <ElButton type="primary">
            Добавить сплит
          </ElButton>
        </div>
      </ElScrollbar>
    </template>
  </NewPayDialog>
  <SystemHeader 
    @open-dialog="handleOpenDialog"
  />
  <div class="size-full p-5">
    <div class="grid grid-cols-2 gap-4">
      <SystemBalanceWidget title="Баланс счетов">
        <ElEmpty v-if="!flag" description="Информации нет" />
      </SystemBalanceWidget>
      <SystemPlanningWidget title="Запланировано">
        <ElEmpty v-if="!flag" description="Информации нет" />
      </SystemPlanningWidget>
      <SystemBudgetWidget title="Бюджет">
        <ElEmpty v-if="!flag" description="Информации нет" />
      </SystemBudgetWidget>
      <SystemExpenses title="Расходы по категориям">
        <ElEmpty v-if="!flag" description="Информации нет" />
      </SystemExpenses>
    </div>
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
<script setup lang="ts">
import { NewShablonGroupDialog } from '@/shared/ui';
import CategoryHeader from './CategoryHeader.vue';
import CategoryTable from './CategoryTable.vue';
import { ref } from 'vue';

const newCategory = ref<boolean>(false)
const newCategoryData = ref({
    name: '',
    type: '',
    in: ''
})
function handleOpenCategoryDialog() {
    newCategory.value = true
}
function handleCloseCategoryDialog() {
    newCategory.value = false
    newCategoryData.value = {
        name: '',
        type: '',
        in: ''
    }
}
</script>

<template>
    <NewShablonGroupDialog
        v-model:new-pay="newCategory"
        title="Новая бюджетная категория"
        @close="handleCloseCategoryDialog"
    >
        <ElForm 
            :model="newCategoryData" 
            label-position="top"
            class="payment-form"
        >
            <ElFormItem label="Название">
                <ElInput v-model="newCategoryData.name" />
            </ElFormItem>
            <ElFormItem label="Тип">
                <ElSelect v-model="newCategoryData.type">
                    <ElOption label="Расходные" value="type 1" />
                    <ElOption label="Приходные" value="type 2" />
                    <ElOption label="Подкатегория" value="type 3" />
                </ElSelect>
            </ElFormItem> 
            <ElFormItem v-if="newCategoryData.type === 'type 3'" label="В*">
                <ElSelect v-model="newCategoryData.in">
                    <ElOption label="Автомойка" value="in 1" />
                    <ElOption label="Стоянка" value="in 2" />
                </ElSelect>
            </ElFormItem>           
        </ElForm>
    </NewShablonGroupDialog>
    <div class="h-full flex flex-col bg-[#ffffff]">
        <CategoryHeader @add-category="handleOpenCategoryDialog" />
        <div class="flex-1 min-h-0">
            <CategoryTable />
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
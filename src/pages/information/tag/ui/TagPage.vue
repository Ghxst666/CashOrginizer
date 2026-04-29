<script setup lang="ts">
import { ref } from 'vue';
import TagHeader from './TagHeader.vue';
import TagTable from './TagTable.vue';
import { NewShablonGroupDialog } from '@/shared/ui';

const newTag = ref<boolean>(false)
const newTagData = ref({
    name: '',
    color: '',
    sort: ''
})
function handleOpenCategoryDialog() {
    newTag.value = true
}
function handleCloseCategoryDialog() {
    newTag.value = false
    newTagData.value = {
        name: '',
        color: '',
        sort: ''
    }
}
</script>

<template>
    <NewShablonGroupDialog
        v-model:new-pay="newTag"
        title="Новый тег"
        @close="handleCloseCategoryDialog"
    >
        <ElForm 
            :model="newTagData" 
            label-position="top"
            class="payment-form"
        >
            <ElFormItem label="Название">
                <ElInput v-model="newTagData.name" />
            </ElFormItem>
            <ElFormItem label="Цвет">
                <ElSelect v-model="newTagData.color">
                    <ElOption label="красный" value="red" />
                    <ElOption label="синий" value="blue" />
                    <ElOption label="зеленый" value="green" />
                </ElSelect>
            </ElFormItem> 
            <ElFormItem label="Сортировка">
                <ElSelect v-model="newTagData.sort">
                    <ElOption label="1" value="1" />
                    <ElOption label="2" value="2" />
                </ElSelect>
            </ElFormItem>           
        </ElForm>
    </NewShablonGroupDialog>
    <div class="h-full flex flex-col bg-[#ffffff]">
        <TagHeader @open-dialog="handleOpenCategoryDialog" />
        <div class="flex-1 min-h-0">
            <TagTable />
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
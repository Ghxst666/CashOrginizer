<script setup lang="ts">
import { NewShablonGroupDialog } from '@/shared/ui';
import BudgetFooter from './BudgetFooter.vue';
import BudgetHeader from './BudgetHeader.vue';
import BudgetTable from './BudgetTable.vue';
import { ref } from 'vue';

const newGroup = ref<boolean>(false)
const newCategory = ref<boolean>(false)

const newGroupData = ref({
    name: '',
    type: '',
    check: ''
})

const newCategoryData = ref({
    category: '',
    limit: '',
    budget: ''
})

function handleOpenGroupDialog() {
    newGroup.value = true
}

function handleOpenCategoryDialog() {
    newCategory.value = true
}

function handleCloseGroupDialog() {
    newGroup.value = false
    newGroupData.value = {
        name: '',
        type: '',
        check: ''
    }
}

function handleCloseCategoryDialog() {
    newCategory.value = false
    newCategoryData.value = {
        category: '',
        limit: '',
        budget: ''
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
            <ElFormItem label="Категория">
                <ElSelect v-model="newCategoryData.category">
                    <ElOption label="автомойка" value="category 1" />
                    <ElOption label="стоянка" value="category 2" />
                </ElSelect>
            </ElFormItem>
            <ElFormItem label="Лимит">
                <ElSelect v-model="newCategoryData.limit">
                    <ElOption label="Ежедневный бюджет" value="limit 1" />
                    <ElOption label="Еженедельный бюджет" value="limit 2" />
                </ElSelect>
            </ElFormItem>
            <ElFormItem label="Месячный бюджет">
                <ElInput v-model="newCategoryData.budget" />
            </ElFormItem>
        </ElForm>
    </NewShablonGroupDialog>
    <NewShablonGroupDialog
        v-model:new-pay="newGroup"
        title="Новая бюджетная группа"
        @close="handleCloseGroupDialog"
    >
        <ElForm 
            :model="newGroupData" 
            label-position="top"
            class="payment-form"
        >
            <ElFormItem label="Название">
                <ElInput v-model="newGroupData.name" />
            </ElFormItem>

            <ElFormItem label="Тип">
                <ElSelect v-model="newGroupData.type">
                    <ElOption label="Приход" value="type 1" />
                    <ElOption label="Расход" value="type 2" />
                </ElSelect>
            </ElFormItem>

            <ElFormItem label="Счет">
                <ElSelect v-model="newGroupData.check">
                    <ElOption label="Счет 1" value="check 1" />
                    <ElOption label="Счет 2" value="check 2" />
                </ElSelect>
            </ElFormItem>
        </ElForm>
    </NewShablonGroupDialog>
    <div class="h-full flex flex-col bg-[#ffffff]">
        <BudgetHeader @add-category="handleOpenCategoryDialog" @add-group="handleOpenGroupDialog" />
        <div class="flex-1 min-h-0">
            <BudgetTable />
        </div>
        <BudgetFooter/>
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
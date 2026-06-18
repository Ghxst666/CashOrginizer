<script setup lang="ts">
import CategoryHeader from './CategoryHeader.vue';
import CategoryTable from './CategoryTable.vue';
import { ref } from 'vue';
import { useCategoriesQuery } from '@/entities/category';
import NewCategoryDialog from '@/shared/ui/NewCategoryDialog.vue';
import SidePropertiesPanel from '@/shared/ui/SidePropertiesPanel.vue';
import type { CategoryRowData } from '@/entities/category/types/category.types';

interface CategoryPeriodFilter {
    period: string
    date_from?: string
    date_to?: string
}

const periodFilter = ref<CategoryPeriodFilter>({ period: 'all_period' })
const { data } = useCategoriesQuery(periodFilter)

const newCategory = ref<boolean>(false)
const isPropertiesOpen = ref(false)
const selectedCategory = ref<CategoryRowData | null>(null)

function handleOpenCategoryDialog() {
    newCategory.value = true
}

function handleShowProperties() {
    isPropertiesOpen.value = true
}

function handleSelectCategory(category: CategoryRowData) {
    selectedCategory.value = category
}

function handleSelectPeriod(filter: CategoryPeriodFilter) {
    periodFilter.value = filter
}

function formattedCategoryType(type: string) {
    return type === 'expenses'
        ? 'Расходные'
        : 'Приходные'
}

function periodTitle() {
    return data.value?.period.label || 'Весь период'
}

function childrenTitles(category: CategoryRowData) {
    return category.children?.map(child => child.title).join(', ') || 'Подкатегорий нет'
}
</script>

<template>
    <NewCategoryDialog 
        v-model="newCategory"
        title="Новая категория"
        v-if="data"
        :categories="data.rows"
    />
    <div class="h-full flex bg-[#ffffff]">
        <div class="flex-1 min-w-0 flex flex-col">
            <CategoryHeader
                :selected-period="periodFilter.period"
                :date-from="periodFilter.date_from"
                :date-to="periodFilter.date_to"
                @add-category="handleOpenCategoryDialog"
                @select-period="handleSelectPeriod"
                @show-properties="handleShowProperties"
            />
            <div class="flex-1 min-h-0">
                <CategoryTable 
                    v-if="data"
                    :data="data"
                    @select="handleSelectCategory"
                />
            </div>
        </div>

        <SidePropertiesPanel
            v-model="isPropertiesOpen"
            title="Свойства категории"
            width="400px"
        >
            <template v-if="selectedCategory">
                <ElForm
                    :model="selectedCategory"
                    label-position="top"
                    class="category-properties-form"
                >
                    <ElFormItem label="Название">
                        <span class="text-[#374151] font-semibold">{{ selectedCategory.title }}</span>
                    </ElFormItem>
                    <ElFormItem label="Тип">
                        <span class="text-[#374151] font-semibold">{{ formattedCategoryType(selectedCategory.type) }}</span>
                    </ElFormItem>
                    <ElFormItem label="Период">
                        <span class="text-[#374151] font-semibold">{{ periodTitle() }}</span>
                    </ElFormItem>
                    <ElFormItem label="Итого">
                        <span class="text-[#374151] font-semibold">{{ selectedCategory.total_formatted }}</span>
                    </ElFormItem>
                    <ElFormItem label="Доход">
                        <span class="text-[#6b7280]">{{ selectedCategory.income_formatted }}</span>
                    </ElFormItem>
                    <ElFormItem label="Расход">
                        <span class="text-[#6b7280]">{{ selectedCategory.expense_formatted }}</span>
                    </ElFormItem>
                    <ElFormItem label="Перевод">
                        <span class="text-[#6b7280]">{{ selectedCategory.transfer_formatted }}</span>
                    </ElFormItem>
                    <ElFormItem label="Включенные подкатегории">
                        <span class="text-[#374151] font-semibold">{{ childrenTitles(selectedCategory) }}</span>
                    </ElFormItem>
                </ElForm>
            </template>

            <template v-else>
                <div class="h-full flex items-center justify-center text-[#9ca3af] text-sm">
                    Выбери категорию в таблице, чтобы посмотреть свойства
                </div>
            </template>
        </SidePropertiesPanel>
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

:deep(.category-properties-form .el-form-item__label) {
  color: #000;
  font-size: 16px;
}
</style>

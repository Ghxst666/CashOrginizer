<script setup lang="ts">
import CategoryHeader from './CategoryHeader.vue';
import CategoryTable from './CategoryTable.vue';
import { ref } from 'vue';
import { useCategoriesQuery } from '@/entities/category';
import NewCategoryDialog from '@/shared/ui/NewCategoryDialog.vue';

interface CategoryPeriodFilter {
    period: string
    date_from?: string
    date_to?: string
}

const periodFilter = ref<CategoryPeriodFilter>({ period: 'all_period' })
const { data } = useCategoriesQuery(periodFilter)

const newCategory = ref<boolean>(false)
function handleOpenCategoryDialog() {
    newCategory.value = true
}

function handleSelectPeriod(filter: CategoryPeriodFilter) {
    periodFilter.value = filter
}
</script>

<template>
    <NewCategoryDialog 
        v-model="newCategory"
        title="Новая категория"
        v-if="data"
        :categories="data.rows"
    />
    <div class="h-full flex flex-col bg-[#ffffff]">
        <CategoryHeader
            :selected-period="periodFilter.period"
            :date-from="periodFilter.date_from"
            :date-to="periodFilter.date_to"
            @add-category="handleOpenCategoryDialog"
            @select-period="handleSelectPeriod"
        />
        <div class="flex-1 min-h-0">
            <CategoryTable 
                v-if="data"
                :data="data" 
            />
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

<script setup lang="ts">
import { computed, ref } from 'vue';
import InformationHeader from './InformationHeader.vue';
import InformationTable from './InformationTable.vue';
import { usePurposesQuery } from '@/entities/purposes';
import type { purposesRowData } from '@/entities/purposes/types/purposes.types';
import { filterRowsBySearch } from '@/shared/lib/search';
import { useHeaderSearchStore } from '@/shared/store/header-search.store';
import { NewPurposesDialog } from '@/shared/ui';
import SidePropertiesPanel from '@/shared/ui/SidePropertiesPanel.vue';

interface InformationPeriodFilter {
  period: string
  date_from?: string
  date_to?: string
}

const newNameDialogVisible = ref<boolean>(false)
const editNameDialogVisible = ref<boolean>(false)
const selectedPurpose = ref<purposesRowData | null>(null)
const selectedEditPurpose = ref<purposesRowData | null>(null)
const isPropertiesOpen = ref(false)
const headerSearchStore = useHeaderSearchStore()

const periodFilter = ref<InformationPeriodFilter>({ period: 'all_period' })
const { data } = usePurposesQuery(periodFilter)
const filteredData = computed(() => {
  if (!data.value)
    return data.value

  return {
    ...data.value,
    rows: filterRowsBySearch(
      data.value.rows,
      headerSearchStore.debouncedQuery,
      purpose => [
        purpose.title,
        purpose.amount,
        purpose.note,
        purpose.category_title,
        purpose.project_title,
        purpose.total,
        purpose.total_formatted,
      ],
    ),
  }
})

function handleOpenDialog() {
  newNameDialogVisible.value = true
}

function handleCloseCreateDialog() {
  newNameDialogVisible.value = false
}

function handleOpenEditDialog(purpose: purposesRowData) {
  selectedPurpose.value = purpose
  selectedEditPurpose.value = purpose
  editNameDialogVisible.value = true
}

function handleCloseEditDialog() {
  editNameDialogVisible.value = false
  selectedEditPurpose.value = null
}

function handleShowProperties() {
  isPropertiesOpen.value = true
}

function handleSelectPurpose(purpose: purposesRowData) {
  selectedPurpose.value = purpose
}

function handleSelectPeriod(filter: InformationPeriodFilter) {
  periodFilter.value = filter
}

function periodTitle() {
  return data.value?.period.label || 'Весь период'
}

function formatMoney(value?: string | null) {
  if (!value)
    return '0,00 р'

  const numericValue = Number(value)

  if (Number.isFinite(numericValue)) {
    return `${numericValue.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} р`
  }

  return `${value} р`
}
</script>

<template>
    <NewPurposesDialog
      v-model="newNameDialogVisible"
      @close="handleCloseCreateDialog"
    />
    <NewPurposesDialog
      v-if="selectedEditPurpose"
      :key="selectedEditPurpose.id"
      v-model="editNameDialogVisible"
      :purpose="selectedEditPurpose"
      @close="handleCloseEditDialog"
    />
    <div class="h-full flex bg-[#ffffff]">
        <div class="flex-1 min-w-0 flex flex-col">
            <InformationHeader
              :selected-period="periodFilter.period"
              :date-from="periodFilter.date_from"
              :date-to="periodFilter.date_to"
              @open-dialog="handleOpenDialog"
              @select-period="handleSelectPeriod"
              @show-properties="handleShowProperties"
            />
            <div class="flex-1 min-h-0">
                <InformationTable
                  v-if="filteredData"
                  :data="filteredData"
                  @edit="handleOpenEditDialog"
                  @select="handleSelectPurpose"
                />
            </div>
        </div>

        <SidePropertiesPanel
          v-model="isPropertiesOpen"
          title="Свойства названия"
          width="400px"
        >
          <template v-if="selectedPurpose">
            <ElForm
              :model="selectedPurpose"
              label-position="top"
              class="purpose-properties-form"
            >
              <ElFormItem label="Название">
                <span class="text-[#374151] font-semibold">{{ selectedPurpose.title }}</span>
              </ElFormItem>
              <ElFormItem label="Период">
                <span class="text-[#374151] font-semibold">{{ periodTitle() }}</span>
              </ElFormItem>
              <ElFormItem label="Итого">
                <span class="text-[#374151] font-semibold">{{ selectedPurpose.total_formatted }}</span>
              </ElFormItem>
              <ElFormItem label="Сумма">
                <span class="text-[#6b7280]">{{ formatMoney(selectedPurpose.amount) }}</span>
              </ElFormItem>
              <ElFormItem label="Категория">
                <span class="text-[#374151] font-semibold">{{ selectedPurpose.category_title || 'Категория не задана' }}</span>
              </ElFormItem>
              <ElFormItem label="Проект">
                <span class="text-[#374151] font-semibold">{{ selectedPurpose.project_title || 'Проект не задан' }}</span>
              </ElFormItem>
              <ElFormItem label="Доход">
                <span class="text-[#6b7280]">{{ selectedPurpose.income_formatted }}</span>
              </ElFormItem>
              <ElFormItem label="Расход">
                <span class="text-[#6b7280]">{{ selectedPurpose.expense_formatted }}</span>
              </ElFormItem>
              <ElFormItem label="Примечание">
                <span class="text-[#6b7280]">{{ selectedPurpose.note || 'Примечание не задано' }}</span>
              </ElFormItem>
            </ElForm>
          </template>

          <template v-else>
            <div class="h-full flex items-center justify-center text-[#9ca3af] text-sm">
              Выбери название в таблице, чтобы посмотреть свойства
            </div>
          </template>
        </SidePropertiesPanel>
    </div>
</template>

<style scoped>
:deep(.purpose-properties-form .el-form-item__label) {
  color: #000;
  font-size: 16px;
}
</style>

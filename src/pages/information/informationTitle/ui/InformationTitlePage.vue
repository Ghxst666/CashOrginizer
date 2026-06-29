<script setup lang="ts">
import { computed, ref } from 'vue';
import InformationHeader from './InformationHeader.vue';
import InformationTable from './InformationTable.vue';
import { usePurposesQuery } from '@/entities/purposes';
import type { purposesRowData } from '@/entities/purposes/types/purposes.types';
import { filterRowsBySearch } from '@/shared/lib/search';
import { useHeaderSearchStore } from '@/shared/store/header-search.store';
import { NewPurposesDialog } from '@/shared/ui';
import { useRouter } from 'vue-router';
import { TRANSACTION_ROUTE } from '@/shared/router';

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
const router = useRouter()

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
        purpose.note,
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

function handleOpenPayments(purpose: purposesRowData) {
  router.push({
    name: TRANSACTION_ROUTE.PAYMENTS.NAME,
    query: {
      purpose_id: String(purpose.id),
      purpose_title: purpose.title,
    },
  })
}

function handleSelectPeriod(filter: InformationPeriodFilter) {
  periodFilter.value = filter
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
                  @open-payments="handleOpenPayments"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.purpose-properties-form .el-form-item__label) {
  color: #000;
  font-size: 16px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import InformationHeader from './InformationHeader.vue';
import InformationTable from './InformationTable.vue';
import { usePurposesQuery } from '@/entities/purposes';
import type { purposesRowData } from '@/entities/purposes/types/purposes.types';
import { NewPurposesDialog } from '@/shared/ui';

interface InformationPeriodFilter {
  period: string
  date_from?: string
  date_to?: string
}

const newNameDialogVisible = ref<boolean>(false)
const editNameDialogVisible = ref<boolean>(false)
const selectedPurpose = ref<purposesRowData | null>(null)

const periodFilter = ref<InformationPeriodFilter>({ period: 'all_period' })
const { data } = usePurposesQuery(periodFilter)

function handleOpenDialog() {
  newNameDialogVisible.value = true
}

function handleCloseCreateDialog() {
  newNameDialogVisible.value = false
}

function handleOpenEditDialog(purpose: purposesRowData) {
  selectedPurpose.value = purpose
  editNameDialogVisible.value = true
}

function handleCloseEditDialog() {
  editNameDialogVisible.value = false
  selectedPurpose.value = null
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
      v-if="selectedPurpose"
      :key="selectedPurpose.id"
      v-model="editNameDialogVisible"
      :purpose="selectedPurpose"
      @close="handleCloseEditDialog"
    />
    <div class="h-full flex flex-col bg-[#ffffff]">
        <InformationHeader
          :selected-period="periodFilter.period"
          :date-from="periodFilter.date_from"
          :date-to="periodFilter.date_to"
          @open-dialog="handleOpenDialog"
          @select-period="handleSelectPeriod"
        />
        <div class="flex-1 min-h-0">
            <InformationTable
              v-if="data"
              :data="data"
              @edit="handleOpenEditDialog"
            />
        </div>
    </div>
</template>

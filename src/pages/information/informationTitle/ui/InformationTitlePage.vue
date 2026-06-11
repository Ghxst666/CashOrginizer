<script setup lang="ts">
import { ref } from 'vue';
import InformationHeader from './InformationHeader.vue';
import InformationTable from './InformationTable.vue';
import CreatePurposeDialog from './CreatePurposeDialog.vue';
import { usePurposesQuery } from '@/entities/purposes';

interface InformationPeriodFilter {
  period: string
  date_from?: string
  date_to?: string
}

const newNameDialogVisible = ref<boolean>(false)

const periodFilter = ref<InformationPeriodFilter>({ period: 'all_period' })
const { data } = usePurposesQuery(periodFilter)

function handleOpenDialog() {
  newNameDialogVisible.value = true
}

function handleCloseDialog() {
  newNameDialogVisible.value = false
}

function handleSelectPeriod(filter: InformationPeriodFilter) {
  periodFilter.value = filter
}
</script>

<template>
    <CreatePurposeDialog
      v-model="newNameDialogVisible"
      @close="handleCloseDialog"
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
            />
        </div>
    </div>
</template>

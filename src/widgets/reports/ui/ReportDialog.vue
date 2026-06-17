<script setup lang="ts">
import { Document, Search, Setting } from '@element-plus/icons-vue'
import type {
    ReportColumn,
    ReportDefinition,
    ReportExportType,
    ReportFilters,
    ReportProperty,
    ReportSummaryView,
    ReportTab,
    SelectOption,
    TableRow,
} from '@/pages/information/report/model/report.types'
import ReportExportDropdown from './ReportExportDropdown.vue'
import ReportPropertiesPanel from './ReportPropertiesPanel.vue'
import ReportResultTable from './ReportResultTable.vue'
import ReportSettingsPanel from './ReportSettingsPanel.vue'
import ReportSummaryBar from './ReportSummaryBar.vue'

defineProps<{
    report: ReportDefinition
    rows: TableRow[]
    columns: ReportColumn[]
    loading: boolean
    exportLoading?: boolean
    rangeLabel: string
    summary: ReportSummaryView
    properties: ReportProperty[]
    groupOptions: SelectOption[]
    accountOptions: SelectOption[]
    purposeOptions: SelectOption[]
    categoryOptions: SelectOption[]
    projectOptions: SelectOption[]
}>()

defineEmits<{
    export: [type: ReportExportType]
    loadOptions: [type: 'groups' | 'accounts' | 'purposes' | 'categories' | 'projects']
}>()

const visible = defineModel<boolean>('visible', { required: true })
const activeTab = defineModel<ReportTab>('activeTab', { required: true })
const paymentSearch = defineModel<string>('paymentSearch', { required: true })
const selectedRow = defineModel<TableRow | null>('selectedRow', { required: true })
const filters = defineModel<ReportFilters>('filters', { required: true })
const selectedGroupId = defineModel<number | null>('selectedGroupId', { required: true })
const customDateRange = defineModel<string[]>('customDateRange', { required: true })
</script>

<template>
    <ElDialog
        v-model="visible"
        class="report-dialog"
        :show-close="false"
        width="96vw"
        top="2vh"
        destroy-on-close
    >
        <template #header>
            <div class="report-dialog__header">
                <strong>{{ report.title }}</strong>
                <div class="report-dialog__actions">
                    <ReportExportDropdown
                        :loading="exportLoading"
                        @export="$emit('export', $event)"
                    />
                    <ElButton size="small" @click="visible = false">
                        Закрыть
                    </ElButton>
                </div>
            </div>
        </template>

        <div class="report-window">
            <div class="report-main">
                <div class="report-toolbar">
                    <ElButton
                        :type="activeTab === 'list' ? 'primary' : 'default'"
                        :icon="Document"
                        @click="activeTab = 'list'"
                    >
                        Список
                    </ElButton>
                    <ElButton
                        :type="activeTab === 'settings' ? 'primary' : 'default'"
                        :icon="Setting"
                        @click="activeTab = 'settings'"
                    >
                        Настройка
                    </ElButton>

                    <ElInput
                        v-if="report.code === 'payments' && activeTab === 'list'"
                        v-model="paymentSearch"
                        class="report-search"
                        clearable
                        placeholder="Найти"
                        :prefix-icon="Search"
                    />
                </div>

                <template v-if="activeTab === 'list'">
                    <div class="report-blue-band">
                        <strong>{{ report.title }}</strong>
                        <span>{{ rangeLabel }} в Российский Рубль</span>
                    </div>

                    <ReportResultTable
                        v-model:selected-row="selectedRow"
                        :report="report"
                        :rows="rows"
                        :columns="columns"
                        :loading="loading"
                    />
                </template>

                <ReportSettingsPanel
                    v-else
                    v-model:filters="filters"
                    v-model:selected-group-id="selectedGroupId"
                    v-model:custom-date-range="customDateRange"
                    :report="report"
                    :group-options="groupOptions"
                    :account-options="accountOptions"
                    :purpose-options="purposeOptions"
                    :category-options="categoryOptions"
                    :project-options="projectOptions"
                    @load-options="$emit('loadOptions', $event)"
                />

                <ReportSummaryBar :summary="summary" />
            </div>

            <ReportPropertiesPanel :properties="properties" />
        </div>
    </ElDialog>
</template>

<style scoped>
.report-dialog :deep(.el-dialog__header) {
  margin: 0;
  padding: 0;
}

.report-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.report-dialog__header {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #9ca8b4;
  background: linear-gradient(#eef2f6, #c8ced6);
  padding: 4px 12px;
  color: #6f7782;
  font-size: 18px;
}

.report-dialog__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.report-window {
  display: grid;
  height: 84vh;
  grid-template-columns: minmax(0, 1fr) 360px;
  background: #fff;
}

.report-main {
  display: flex;
  min-width: 0;
  flex-direction: column;
  border-right: 1px solid #aeb8c2;
}

.report-toolbar {
  display: flex;
  min-height: 45px;
  align-items: center;
  gap: 8px;
  background: #cfd5d6;
  padding: 6px 10px;
}

.report-search {
  margin-left: auto;
  width: 150px;
}

.report-blue-band {
  display: flex;
  min-height: 44px;
  flex-direction: column;
  justify-content: center;
  background: #069bd3;
  padding: 4px 10px;
  color: #fff;
  font-size: 12px;
}

@media (max-width: 1180px) {
  .report-window {
    grid-template-columns: minmax(0, 1fr) 280px;
  }
}
</style>

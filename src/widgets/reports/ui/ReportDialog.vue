<script setup lang="ts">
import { Document, Search, Setting } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
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
import { PERIOD_OPTIONS } from '@/pages/information/report/model/report.config'

const props = defineProps<{
    report: ReportDefinition
    rows: TableRow[]
    columns: ReportColumn[]
    loading: boolean
    exportLoading?: boolean
    rangeLabel: string
    summary: ReportSummaryView
    properties: ReportProperty[]
    accountOptions: SelectOption[]
    purposeOptions: SelectOption[]
    categoryOptions: SelectOption[]
    projectOptions: SelectOption[]
}>()

defineEmits<{
    export: [type: ReportExportType]
    loadOptions: [type: 'accounts' | 'purposes' | 'categories' | 'projects']
}>()

const visible = defineModel<boolean>('visible', { required: true })
const activeTab = defineModel<ReportTab>('activeTab', { required: true })
const paymentSearch = defineModel<string>('paymentSearch', { required: true })
const selectedRow = defineModel<TableRow | null>('selectedRow', { required: true })
const filters = defineModel<ReportFilters>('filters', { required: true })
const customDateRange = defineModel<string[]>('customDateRange', { required: true })
const categoryType = defineModel<string | null>('categoryType', { required: true })
const activeSettingsField = ref('title')
const rightSearch = ref('')
const isReferenceField = computed(() => ['accounts_ids', 'purposes_ids', 'categories_ids', 'projects_ids'].includes(activeSettingsField.value))
const rightOptions = computed(() => {
    const source = activeSettingsField.value === 'accounts_ids' ? props.accountOptions
        : activeSettingsField.value === 'purposes_ids' ? props.purposeOptions
        : activeSettingsField.value === 'categories_ids' ? props.categoryOptions
        : activeSettingsField.value === 'projects_ids' ? props.projectOptions
        : []
    const query = rightSearch.value.trim().toLocaleLowerCase()
    const isCategoryField = activeSettingsField.value === 'categories_ids'

    return source.filter(option => (
        (!query || option.label.toLocaleLowerCase().includes(query))
        && (!isCategoryField || !categoryType.value || option.type === categoryType.value)
    ))
})

function selectedIds() {
    if (activeSettingsField.value === 'accounts_ids') return filters.value.accounts_ids
    if (activeSettingsField.value === 'purposes_ids') return filters.value.purposes_ids
    if (activeSettingsField.value === 'categories_ids') return filters.value.categories_ids
    if (activeSettingsField.value === 'projects_ids') return filters.value.projects_ids
    return []
}

function toggleOption(id: number | string) {
    const ids = selectedIds()
    const numericId = Number(id)
    const next = ids.includes(numericId) ? ids.filter(value => value !== numericId) : [...ids, numericId]
    if (activeSettingsField.value === 'accounts_ids') filters.value.accounts_ids = next
    if (activeSettingsField.value === 'purposes_ids') filters.value.purposes_ids = next
    if (activeSettingsField.value === 'categories_ids') filters.value.categories_ids = next
    if (activeSettingsField.value === 'projects_ids') filters.value.projects_ids = next
}
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
                    class="report-main__settings"
                    v-model:filters="filters"
                    v-model:active-field="activeSettingsField"
                    v-model:custom-date-range="customDateRange"
                    :report="report"
                    :account-options="accountOptions"
                    :purpose-options="purposeOptions"
                    :category-options="categoryOptions"
                    :project-options="projectOptions"
                    @load-options="$emit('loadOptions', $event)"
                />

                <ReportSummaryBar :summary="summary" />
            </div>

            <ReportPropertiesPanel
                v-if="activeTab === 'list'"
                :properties="properties"
            />
            <aside v-else-if="activeTab === 'settings'" class="report-settings-side">
              <ElScrollbar class="report-settings-side__scroll">
                <div class="report-settings-side__content">
                <template v-if="isReferenceField">
                    <ElInput v-model="rightSearch" placeholder="Найти" clearable />
                    <div v-if="activeSettingsField === 'categories_ids'" class="category-types">
                        <ElButton size="small" :type="categoryType === 'expenses' ? 'primary' : 'default'" @click="categoryType = categoryType === 'expenses' ? null : 'expenses'">Расходы</ElButton>
                        <ElButton size="small" :type="categoryType === 'profits' ? 'primary' : 'default'" @click="categoryType = categoryType === 'profits' ? null : 'profits'">Доходы</ElButton>
                        <ElButton size="small" :type="categoryType === 'transfers' ? 'primary' : 'default'" @click="categoryType = categoryType === 'transfers' ? null : 'transfers'">Переводы</ElButton>
                    </div>
                    <ElCheckbox
                        v-for="option in rightOptions"
                        :key="option.value"
                        :model-value="selectedIds().includes(Number(option.value))"
                        class="side-option"
                        @change="toggleOption(option.value)"
                    >
                        <span
                            class="side-option__label"
                            :style="{ paddingLeft: `${(option.level ?? 0) * 16}px` }"
                        >
                            {{ option.label }}
                        </span>
                    </ElCheckbox>
                </template>
                <ElInput v-else-if="activeSettingsField === 'title'" v-model="filters.title" placeholder="Название отчёта" />
                <ElInput v-else-if="activeSettingsField === 'note'" v-model="filters.note" type="textarea" :rows="8" placeholder="Примечание" />
                <ElInput v-else-if="activeSettingsField === 'text'" v-model="filters.text" placeholder="Текст" />
                <div v-else-if="activeSettingsField === 'amount'" class="side-inline"><ElInput v-model="filters.amount_from" placeholder="От" /><ElInput v-model="filters.amount_to" placeholder="До" /></div>
                <div v-else-if="activeSettingsField === 'period'" class="report-settings-side__date">
                    <ElButton
                        v-for="option in PERIOD_OPTIONS"
                        :key="option.value"
                        class="period-option"
                        :type="filters.period === option.value ? 'primary' : 'default'"
                        @click="filters.period = option.value"
                    >
                        {{ option.label }}
                    </ElButton>
                    <ElDatePicker
                        v-if="filters.period === 'custom'"
                        v-model="customDateRange"
                        class="period-date-input"
                        type="daterange"
                        value-format="YYYY-MM-DD"
                        format="DD.MM.YYYY"
                        start-placeholder="Дата с"
                        end-placeholder="Дата по"
                    />
                </div>
                <span v-else class="report-settings-side__hint">Выберите поле слева</span>
                </div>
              </ElScrollbar>
            </aside>
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
  min-height: 0;
  grid-template-columns: minmax(0, 1fr) 360px;
  background: #fff;
}

.report-main {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  border-right: 1px solid #aeb8c2;
}

.report-main__settings {
  flex: 1;
  min-height: 0;
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

.report-settings-side { display: flex; min-width: 0; min-height: 0; flex-direction: column; }
.report-settings-side__scroll { flex: 1; min-height: 0; }
.report-settings-side__content { display: flex; min-width: 0; flex-direction: column; gap: 10px; padding: 12px; }
.category-types, .side-inline { display: flex; flex-wrap: wrap; gap: 6px; }
.side-option { margin-right: 0; padding: 8px 0; }
.side-option__label { display: inline-block; }
.report-settings-side__hint { color: #6b7280; font-size: 14px; }
.report-settings-side__date { display: flex; flex-direction: column; gap: 8px; }
.period-option { width: 100%; justify-content: flex-start; margin: 0; }
.period-date-input { width: 100%; }

@media (max-width: 1180px) {
  .report-window {
    grid-template-columns: minmax(0, 1fr) 280px;
  }
}

@media (max-width: 768px) {
  .report-dialog__header {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    font-size: 16px;
  }

  .report-dialog__actions {
    width: 100%;
    justify-content: space-between;
  }

  .report-window {
    height: calc(100dvh - 128px);
    grid-template-columns: 1fr;
    overflow: hidden;
  }

  .report-main {
    min-height: 0;
    border-right: 0;
  }

  .report-toolbar {
    flex-wrap: wrap;
    min-height: auto;
    padding: 8px;
  }

  .report-toolbar .el-button {
    flex: 1 1 120px;
    margin-left: 0;
  }

  .report-search {
    width: 100%;
    margin-left: 0;
  }

  .report-blue-band {
    min-height: 54px;
    padding: 8px 10px;
  }

  .report-settings-side {
    min-height: 180px;
    max-height: 32dvh;
    border-top: 1px solid #d7dde5;
  }
}
</style>

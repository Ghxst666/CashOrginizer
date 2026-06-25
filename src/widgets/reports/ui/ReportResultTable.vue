<script setup lang="ts">
import type { ReportColumn, ReportDefinition, TableRow } from '@/pages/information/report/model/report.types'
import { filterTreeRowsBySearch } from '@/shared/lib/search'
import { useHeaderSearchStore } from '@/shared/store/header-search.store'
import { computed } from 'vue'

const props = defineProps<{
    report: ReportDefinition
    rows: TableRow[]
    columns: ReportColumn[]
    loading: boolean
}>()

const selectedRow = defineModel<TableRow | null>('selectedRow', { required: true })
const headerSearchStore = useHeaderSearchStore()
const filteredRows = computed(() => filterTreeRowsBySearch(
    props.rows,
    headerSearchStore.debouncedQuery,
    row => props.columns.map(column => getCellValue(row, column)),
))

function getTableRowKey(row: TableRow) {
    return [
        row.payment_id,
        row.category_id,
        row.project_id,
        row.purpose_id,
        row.id,
        row.kind,
        row.title,
    ].filter(value => value !== undefined && value !== null).join(':')
}

function getCellValue(row: TableRow, column: ReportColumn) {
    const value = row[column.prop]
    if (column.prop === 'title' && !value) return props.report.emptyTitle
    if (column.prop === 'payment_date' && typeof value === 'string') return formatDate(value)

    return value ?? ''
}

function isNegative(value: unknown) {
    return String(value ?? '').trim().startsWith('-')
}

function formatDate(value: string) {
    const [year, month, day] = value.split('-')
    if (!year || !month || !day) return value

    return `${day}.${month}.${year}`
}
</script>

<template>
    <div class="report-table-wrap">
        <ElTable
            v-loading="loading"
            border
            height="100%"
            highlight-current-row
            :data="filteredRows"
            :row-key="getTableRowKey"
            :tree-props="{ children: 'children' }"
            @row-click="(row: TableRow) => selectedRow = row"
        >
            <ElTableColumn
                v-for="column in columns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :width="column.width"
                :align="column.align"
            >
                <template #default="{ row }">
                    <span :class="column.money && isNegative(getCellValue(row, column)) ? 'money-negative' : ''">
                        {{ getCellValue(row, column) }}
                    </span>
                </template>
            </ElTableColumn>
        </ElTable>
    </div>
</template>

<style scoped>
.report-table-wrap {
  flex: 1;
  min-height: 0;
}

.money-negative {
  color: #d81e06;
}
</style>

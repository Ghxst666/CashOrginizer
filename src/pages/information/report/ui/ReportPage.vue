<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useCategoriesQuery } from '@/entities/category'
import { useProjectsQuery } from '@/entities/project'
import {
    useCategoriesReportQuery,
    useIncomeExpenseReportQuery,
    usePaymentsReportQuery,
    useProjectsReportQuery,
    usePurposesReportQuery,
    type ReportsRequest,
} from '@/entities/reports'
import { usePurposesQuery } from '@/entities/purposes'
import { useAccountsQuery } from '@/entities/transaction/invoices'
import { exportReportToExcel, exportReportToPdf } from '@/features/reports/export/report-export'
import { clearEmptyProperties } from '@/shared/lib/clearEmptyProperties'
import ReportDialog from '@/widgets/reports/ui/ReportDialog.vue'
import ReportsCatalog from '@/widgets/reports/ui/ReportsCatalog.vue'
import { HIDDEN_PROPERTY_KEYS, PERIOD_OPTIONS, PROPERTY_LABELS, REPORTS } from '../model/report.config'
import type {
    ReportColumn,
    ReportDefinition,
    ReportExportPayload,
    ReportExportType,
    ReportFilters,
    ReportProperty,
    ReportSummaryView,
    ReportTab,
    SelectOption,
    TableRow,
} from '../model/report.types'

const dialogVisible = ref(false)
const activeTab = ref<ReportTab>('list')
const activeReportCode = ref(REPORTS[0].code)
const customDateRange = ref<string[]>([])
const selectedRow = ref<TableRow | null>(null)
const paymentSearch = ref('')
const exportLoading = ref(false)
const optionsEnabled = reactive({
    accounts: false,
    purposes: false,
    categories: false,
    projects: false,
})

const filters = reactive<ReportFilters>({
    period: 'year_to_today',
    title: '',
    note: '',
    accounts_ids: [],
    purposes_ids: [],
    categories_ids: [],
    projects_ids: [],
    text: '',
    amount_from: null,
    amount_to: null,
})

const { data: accountsData } = useAccountsQuery(true, computed(() => optionsEnabled.accounts))
const { data: categoriesData } = useCategoriesQuery(undefined, computed(() => optionsEnabled.categories))
const { data: projectsData } = useProjectsQuery(undefined, computed(() => optionsEnabled.projects))
const { data: purposesData } = usePurposesQuery(undefined, computed(() => optionsEnabled.purposes))

const activeReport = computed(() => REPORTS.find(report => report.code === activeReportCode.value) ?? REPORTS[0])

const requestData = computed<ReportsRequest | undefined>(() => {
    const [dateFrom, dateTo] = customDateRange.value
    const payload: ReportsRequest = {
        kind: activeReport.value.kind,
        period: filters.period,
        title: filters.title || undefined,
        note: filters.note || undefined,
        accounts_ids: filters.accounts_ids.join(',') || undefined,
        purposes_ids: filters.purposes_ids.join(',') || undefined,
        categories_ids: filters.categories_ids.join(',') || undefined,
        projects_ids: filters.projects_ids.join(',') || undefined,
        text: filters.text,
        amount_from: filters.amount_from,
        amount_to: filters.amount_to,
        date_from: filters.period === 'custom' ? dateFrom : undefined,
        date_to: filters.period === 'custom' ? dateTo : undefined,
    }

    return clearEmptyProperties(payload) as ReportsRequest | undefined
})

const purposesReportQuery = usePurposesReportQuery(
    requestData,
    computed(() => dialogVisible.value && activeReportCode.value === 'purposes'),
)
const categoriesReportQuery = useCategoriesReportQuery(
    requestData,
    computed(() => dialogVisible.value && activeReportCode.value === 'categories'),
)
const projectsReportQuery = useProjectsReportQuery(
    requestData,
    computed(() => dialogVisible.value && activeReportCode.value === 'projects'),
)
const incomeExpenseReportQuery = useIncomeExpenseReportQuery(
    requestData,
    computed(() => dialogVisible.value && activeReportCode.value === 'income_expense'),
)
const paymentsReportQuery = usePaymentsReportQuery(
    requestData,
    computed(() => dialogVisible.value && activeReportCode.value === 'payments'),
)

const currentQuery = computed(() => {
    if (activeReportCode.value === 'categories') return categoriesReportQuery
    if (activeReportCode.value === 'projects') return projectsReportQuery
    if (activeReportCode.value === 'income_expense') return incomeExpenseReportQuery
    if (activeReportCode.value === 'payments') return paymentsReportQuery

    return purposesReportQuery
})

const currentReportData = computed(() => currentQuery.value.data.value)
const reportRows = computed<TableRow[]>(() => currentReportData.value?.rows as TableRow[] ?? [])
const isReportLoading = computed(() => currentQuery.value.isLoading.value || currentQuery.value.isFetching.value)

const reportRangeLabel = computed(() => {
    const period = currentReportData.value?.period
    if (period?.from && period?.to) return `${formatDate(period.from)} - ${formatDate(period.to)}`
    if (period?.label) return period.label

    return PERIOD_OPTIONS.find(option => option.value === filters.period)?.label ?? 'Период'
})

const tableRows = computed(() => {
    if (activeReportCode.value !== 'payments' || !paymentSearch.value.trim()) return reportRows.value

    const search = paymentSearch.value.trim().toLowerCase()

    return reportRows.value.filter(row => Object.values(row).some(value => String(value ?? '').toLowerCase().includes(search)))
})

const tableColumns = computed<ReportColumn[]>(() => {
    if (activeReportCode.value === 'payments') {
        return [
            { prop: 'payment_date', label: 'Дата', width: 120, align: 'center' },
            { prop: 'title', label: 'Название' },
            { prop: 'account_title', label: 'Счет', width: 210 },
            { prop: 'amount_formatted', label: 'Сумма', width: 180, align: 'right', money: true },
        ]
    }

    if (activeReportCode.value === 'income_expense') {
        return [
            { prop: 'title', label: 'Дата' },
            { prop: 'income_formatted', label: 'Приход', width: 170, align: 'right', money: true },
            { prop: 'expense_formatted', label: 'Расход', width: 170, align: 'right', money: true },
            { prop: 'amount_formatted', label: 'Итого', width: 180, align: 'right', money: true },
        ]
    }

    return [
        { prop: 'title', label: activeReport.value.firstColumnLabel },
        { prop: 'amount_formatted', label: reportRangeLabel.value, width: 260, align: 'right', money: true },
    ]
})

const accountOptions = computed<SelectOption[]>(() => (accountsData.value ?? [])
    .map(account => ({
        label: account.title,
        value: account.id,
    })))

const categoryOptions = computed(() => mapRowsToOptions(categoriesData.value?.rows ?? []))
const projectOptions = computed(() => mapRowsToOptions(projectsData.value?.rows ?? []))
const purposeOptions = computed(() => mapRowsToOptions(purposesData.value?.rows ?? []))

const summary = computed<ReportSummaryView>(() => ({
    income: currentReportData.value?.summary?.total_income_formatted ?? '0,00 р',
    expense: currentReportData.value?.summary?.total_expense_formatted ?? '0,00 р',
    total: currentReportData.value?.summary?.total_amount_formatted ?? '0,00 р',
}))

const selectedProperties = computed<ReportProperty[]>(() => {
    if (!selectedRow.value) return []

    return Object.entries(selectedRow.value)
        .filter(([key, value]) => !HIDDEN_PROPERTY_KEYS.has(key) && value !== null && value !== undefined && value !== '')
        .slice(0, 12)
        .map(([key, value]) => ({
            key,
            label: PROPERTY_LABELS[key] ?? key,
            value: formatPropertyValue(key, value),
        }))
})

const exportPayload = computed<ReportExportPayload>(() => ({
    title: activeReport.value.title,
    rangeLabel: `${reportRangeLabel.value} в Российский Рубль`,
    columns: tableColumns.value,
    rows: tableRows.value,
    summary: summary.value,
    summaryData: currentReportData.value?.summary,
}))

watch(
    () => filters.period,
    (period) => {
        if (period !== 'custom') customDateRange.value = []
    },
)

watch(tableRows, rows => {
    selectedRow.value = rows[0] ?? null
})

function openReport(report: ReportDefinition) {
    activeReportCode.value = report.code
    activeTab.value = 'list'
    paymentSearch.value = ''
    selectedRow.value = null
    dialogVisible.value = true
}

async function handleExport(type: ReportExportType) {
    try {
        exportLoading.value = true

        if (type === 'pdf') {
            await exportReportToPdf(exportPayload.value)
        }
        else {
            await exportReportToExcel(exportPayload.value)
        }

        ElMessage.success({
            message: 'Отчет сохранен',
            plain: true,
        })
    }
    catch (error) {
        if (isAbortError(error)) return

        ElMessage.error({
            message: 'Не удалось сохранить отчет',
            plain: true,
        })
    }
    finally {
        exportLoading.value = false
    }
}

function handleLoadOptions(type: keyof typeof optionsEnabled) {
    optionsEnabled[type] = true
}

function isAbortError(error: unknown) {
    return error instanceof DOMException && error.name === 'AbortError'
}

function mapRowsToOptions(rows: readonly unknown[]): SelectOption[] {
    return rows.flatMap(row => {
        const item = row as TableRow
        const option = {
            label: String(item.title ?? 'Без названия'),
            value: Number(item.id),
            type: typeof item.type === 'string' ? item.type : undefined,
        }
        const children = Array.isArray(item.children) ? mapRowsToOptions(item.children) : []

        return Number.isFinite(option.value) ? [option, ...children] : children
    })
}

function formatPropertyValue(key: string, value: unknown) {
    if (key === 'payment_date' && typeof value === 'string') return formatDate(value)

    return value
}

function formatDate(value: string) {
    const [year, month, day] = value.split('-')
    if (!year || !month || !day) return value

    return `${day}.${month}.${year}`
}
</script>

<template>
    <div class="h-full bg-white">
        <ReportsCatalog
            :reports="REPORTS"
            @select="openReport"
        />

        <ReportDialog
            v-model:visible="dialogVisible"
            v-model:active-tab="activeTab"
            v-model:payment-search="paymentSearch"
            v-model:selected-row="selectedRow"
            v-model:filters="filters"
            v-model:custom-date-range="customDateRange"
            :report="activeReport"
            :rows="tableRows"
            :columns="tableColumns"
            :loading="isReportLoading"
            :export-loading="exportLoading"
            :range-label="reportRangeLabel"
            :summary="summary"
            :properties="selectedProperties"
            :account-options="accountOptions"
            :purpose-options="purposeOptions"
            :category-options="categoryOptions"
            :project-options="projectOptions"
            @export="handleExport"
            @load-options="handleLoadOptions"
        />
    </div>
</template>

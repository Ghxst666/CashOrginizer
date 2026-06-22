import type { ReportsRequest, ReportsSummaryData } from '@/entities/reports'

export type ReportCode = 'purposes' | 'categories' | 'projects' | 'income_expense' | 'payments'
export type ReportTab = 'list' | 'settings'
export type ReportKind = NonNullable<ReportsRequest['kind']>
export type ReportExportType = 'pdf' | 'excel'

export interface ReportDefinition {
    code: ReportCode
    kind?: ReportKind
    title: string
    listTitle: string
    description: string
    firstColumnLabel: string
    emptyTitle: string
    icon: unknown
}

export interface ReportFilters {
    period: string
    title: string
    note: string
    accounts_ids: number[]
    purposes_ids: number[]
    categories_ids: number[]
    projects_ids: number[]
    text: string
    amount_from: string | null
    amount_to: string | null
}

export interface SelectOption {
    label: string
    value: number | string
    type?: string
}

export interface TableRow {
    [key: string]: unknown
    children?: TableRow[]
}

export interface ReportColumn {
    prop: string
    label: string
    width?: number | string
    align?: 'left' | 'center' | 'right'
    money?: boolean
}

export interface ReportProperty {
    key: string
    label: string
    value: unknown
}

export interface ReportSummaryView {
    income: string
    expense: string
    total: string
}

export interface ReportExportPayload {
    title: string
    rangeLabel: string
    columns: ReportColumn[]
    rows: TableRow[]
    summary: ReportSummaryView
    summaryData?: ReportsSummaryData
}

export interface ReportsRequest {
    period?: string
    date_from?: string
    date_to?: string
    method?: string
    planned_status?: string
    accounts_ids?: number[] | string[]
}

export interface ReportsPeriodData {
    requested: string
    from: string
    to: string
    label: string
}

export interface ReportsSummaryData {
    rows_count: number
    income: string
    income_formatted: string
    expense: string
    expense_formatted: string
    transfer: string
    transfer_formatted: string
    total: string
    total_formatted: string
}

export interface ReportsResponseData<TRow> {
    method: string
    planned_status: string
    period: ReportsPeriodData
    summary: ReportsSummaryData
    rows: TRow[]
}

export interface ReportsTotalFields {
    income: string
    income_formatted: string
    expense: string
    expense_formatted: string
    transfer: string
    transfer_formatted: string
    total: string
    total_formatted: string
}

export interface ReportsPurposeRowData extends ReportsTotalFields {
    title: string
    amount: string | null
    note: string | null
    category_id: number | null
    project_id: number | null
    id: number
    category_title: string | null
    project_title: string | null
}

export interface ReportsCategoryRowData extends ReportsTotalFields {
    title: string
    type: string
    parent_id: number | null
    id: number
    children: ReportsCategoryRowData[]
}

export interface ReportsProjectRowData extends ReportsTotalFields {
    title: string
    parent_id: number | null
    money_limit: number
    note: string | null
    status: string
    id: number
    children: ReportsProjectRowData[]
}

export type ReportsIncomeExpenseRowData = ReportsTotalFields & Record<string, unknown>

export type ReportsPaymentRowData = Record<string, unknown>

export type PurposesReportResponseData = ReportsResponseData<ReportsPurposeRowData>
export type CategoriesReportResponseData = ReportsResponseData<ReportsCategoryRowData>
export type ProjectsReportResponseData = ReportsResponseData<ReportsProjectRowData>
export type IncomeExpenseReportResponseData = ReportsResponseData<ReportsIncomeExpenseRowData>
export type PaymentsReportResponseData = ReportsResponseData<ReportsPaymentRowData>

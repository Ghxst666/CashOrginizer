export interface ReportsRequest {
    period?: string
    date_from?: string
    date_to?: string
    text?: string | null
    amount_from?: string | number | null
    amount_to?: string | number | null
    accounts_ids?: number[]
    purposes_ids?: number[]
    categories_ids?: number[]
    projects_ids?: number[]
}

export interface ReportsPeriodData {
    requested: string
    from: string
    to: string
    label: string
}

export interface ReportsSummaryData {
    rows_count: number
    income?: string
    income_formatted?: string
    total_income_formatted?: string
    expense?: string
    expense_formatted?: string
    total_expense_formatted?: string
    transfer?: string
    transfer_formatted?: string
    total?: string
    total_formatted?: string
    total_amount_formatted?: string
}

export interface ReportsResponseData<TRow> {
    method: string
    period: ReportsPeriodData
    summary: ReportsSummaryData
    rows: TRow[]
}

export interface ReportsTotalFields {
    income?: string
    income_formatted?: string
    expense?: string
    expense_formatted?: string
    transfer?: string
    transfer_formatted?: string
    total?: string
    total_formatted?: string
    amount?: string
    amount_formatted?: string
}

export interface ReportsPurposeRowData extends ReportsTotalFields {
    title: string
    note: string | null
    category_id: number | null
    project_id: number | null
    purpose_id?: number
    id?: number
    category_title: string | null
    project_title: string | null
    payments_count?: number
}

export interface ReportsCategoryRowData extends ReportsTotalFields {
    title: string
    kind?: string
    type: string
    parent_id: number | null
    category_id?: number
    id?: number
    children: ReportsCategoryRowData[]
}

export interface ReportsProjectRowData extends ReportsTotalFields {
    title: string
    kind?: string
    parent_id: number | null
    money_limit?: number
    note?: string | null
    status?: string
    project_id?: number
    id?: number
    children: ReportsProjectRowData[]
}

export type ReportsIncomeExpenseRowData = ReportsTotalFields & Record<string, unknown>

export type ReportsPaymentRowData = Record<string, unknown>

export type PurposesReportResponseData = ReportsResponseData<ReportsPurposeRowData>
export type CategoriesReportResponseData = ReportsResponseData<ReportsCategoryRowData>
export type ProjectsReportResponseData = ReportsResponseData<ReportsProjectRowData>
export type IncomeExpenseReportResponseData = ReportsResponseData<ReportsIncomeExpenseRowData>
export type PaymentsReportResponseData = ReportsResponseData<ReportsPaymentRowData>

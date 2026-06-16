export interface purposesRequest {
    period: string
    date_from: string
    date_to: string
    method: string
    planned_status: string
    accounts_ids: string[]
}

export interface purposesResponseData {
    method: string
    planned_status: string
    period: purposesPeriodData
    summary: purposesSummaryData
    rows: purposesRowData[]
}

export interface purposesPeriodData {
    requested: string,
    from: string,
    to: string,
    label: string
}

export interface purposesSummaryData {
    rows_count: number,
    income: string,
    income_formatted: string,
    expense: string,
    expense_formatted: string,
    transfer: string,
    transfer_formatted: string,
    total: string,
    total_formatted: string
}

export interface purposesRowData {
    title: string,
    amount: string | null,
    note: string | null,
    category_id: number | null,
    project_id: number | null,
    id: number,
    category_title: string | null,
    project_title: string | null,
    income: string,
    income_formatted: string,
    expense: string,
    expense_formatted: string,
    transfer: string,
    transfer_formatted: string,
    total: string,
    total_formatted: string
}

export interface createPurposesData {
    title: string
    amount?: string | null
    note?: string | null
    category_id?: number | null
    project_id?: number | null
}

export type updatePurposesData = Partial<createPurposesData>

export interface PurposeData {
    title: string
    amount: string | null
    note: string | null
    category_id: number | null
    project_id: number | null
    id: number
    category_title?: string | null
    project_title?: string | null
}

export interface CreatePurposesResponseData {
    status: string
    data: PurposeData
}

export interface ItemPurposesResponseData {
    title: string,
    amount: string | null,
    note: string | null,
    category_id: number | null,
    project_id: number | null,
    id: number,
    category_title: string | null,
    project_title: string | null,
}

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
    amount: number,
    note: string,
    category_id: number,
    project_id: number,
    is_auto_update: boolean,
    id: number,
    category_title: string,
    project_title: string,
    tags: number[],
    splits: number[],
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
    title: string,
    amount: number,
    note: string,
    category_id: number,
    project_id: number,
    is_auto_update: boolean,
    tags_ids: number[]
}

export interface ItemPurposesResponseData {
    title: string,
    amount: number,
    note: string,
    category_id: number,
    project_id: number,
    is_auto_update: boolean,
    id: number,
    category_title: string,
    project_title: string,
    tags: number[],
    splits: number[],
}

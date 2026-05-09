export interface CategoryRequest {
    period: string
    date_from: string
    date_to: string
    method: string
    planned_status: string
    accounts_ids: string[]
}

export interface CategoryResponseData {
    method: string
    planned_status: string
    period: CategoryPeriodData
    summary: CategorySummaryData
    rows: CategoryRowData[]
}

export interface CategoryPeriodData {
    requested: string,
    from: string,
    to: string,
    label: string
}

export interface CategorySummaryData {
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

export interface CategoryRowData {
    title: string,
    type: string,
    parent_id: number,
    id: number,
    income: string,
    income_formatted: string,
    expense: string,
    expense_formatted: string,
    transfer: string,
    transfer_formatted: string,
    total: string,
    total_formatted: string
    children: CategoryChildrenData[]
}

export type CategoryChildrenData = CategoryRowData

export interface CreateCategoryData {
    title: string
    type: string
    parent_id: number
}
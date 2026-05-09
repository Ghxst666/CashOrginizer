export interface projectsRequest {
    period: string
    date_from: string
    date_to: string
    method: string
    planned_status: string
    accounts_ids: string[]
}

export interface projectsResponseData {
    method: string
    planned_status: string
    period: projectsPeriodData
    summary: projectsSummaryData
    rows: projectsRowData[]
}

export interface projectsPeriodData {
    requested: string,
    from: string,
    to: string,
    label: string
}

export interface projectsSummaryData {
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

export interface projectsRowData {
    title: string,
    parent_id: number,
    money_limit: number,
    note: string,
    status: string,
    id: number,
    income: string,
    income_formatted: string,
    expense: string,
    expense_formatted: string,
    transfer: string,
    transfer_formatted: string,
    total: string,
    total_formatted: string
    children: projectsChildrenData[]
}

export type projectsChildrenData = projectsRowData

export interface projectCreateData {
    title: string,
    parent_id: number,
    money_limit: number,
    note: string,
    status: string,
}
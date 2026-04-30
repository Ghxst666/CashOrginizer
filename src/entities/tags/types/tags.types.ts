export interface TagsRequest {
    period: string
    date_from: string
    date_to: string
    method: string
    planned_status: string
    accounts_ids: string[]
}

export interface TagsResponse {
    method: string
    planned_status: string
    period: TagsPeriodData
    summary: TagsSummaryData
    rows: TagsRowData[]
}

export interface TagsPeriodData {
    requested: string,
    from: string,
    to: string,
    label: string
}

export interface TagsSummaryData {
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

export interface TagsRowData {
    title: string,
    color: string,
    sorting: number,
    id: number,
    income: string,
    income_formatted: string,
    expense: string,
    expense_formatted: string,
    transfer: string,
    transfer_formatted: string,
    total: string,
    total_formatted: string
}

export interface CreateTagRequestData {
    title: string
    color: string
    sorting: number
}

export interface CreateTagResponse {
    status: string
    data: CreateTagResponseData[]
}

export interface CreateTagResponseData {
    title: string
    color: string
    sorting: number
    id: number
}
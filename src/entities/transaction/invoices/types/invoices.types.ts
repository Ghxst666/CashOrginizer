export type AccountCurrency = 'RUB' | 'USD'

export interface accountsResponse {
    title: string,
    type: string,
    start_amount: string,
    min_amount: string,
    credit_limit_amount: string,
    note: string,
    status: boolean,
    group_id: number | null,
    id: number,
    amount: string,
    currency: AccountCurrency,
    exchange_rate?: number | string | null,
    sort_order: number
}

export interface AccountsSummaryResponse {
    accounts_count: number
    total_amount: string
    total_amount_formatted: string
    total_income: string
    total_income_formatted: string
    total_expense: string
    total_expense_formatted: string
}

export interface AccountsListResponse<T = accountsResponse> {
    summary: AccountsSummaryResponse
    data: T[]
}

export interface accountsCreateRequest {
    title: string,
    type: string,
    start_amount: number,
    min_amount: number,
    credit_limit_amount: number,
    note: string,
    status: boolean,
    group_id: number | null,
    currency: AccountCurrency,
}

export interface accountsCreateResponse {
    status: string,
    data: accountsData
}

export interface accountsReorderRequest {
    account_ids: number[]
}

export interface accountsData {
    title: string,
    user_id: number,
    type: string,
    amount: number,
    note: string,
    credit_limit_amount: number,
    start_amount: number,
    id: number,
    min_amount: number,
    status: boolean
    group_id: number,
}

export type accountsSortedByStatusResponse = accountsResponse[]

export interface accountsSortedByTypeResponse {
    type: string
    title: string
    accounts: accountsResponse[]
}

export interface accountsSortedByGroupsResponse {
    group_id: number
    title: string
    accounts: accountsResponse[]
}

export type accountsGroupItemResponse = accountsResponse[]

export type accountUserItemResponse = accountsResponse

export type accountPartialEditItemRequestData = accountsCreateRequest

export type accountEditRequesData = accountsCreateRequest & {
  exchange_rate: number | null
}







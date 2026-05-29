export interface accountsResponse {
    title: string,
    type: string,
    start_amount: string,
    min_amount: string,
    credit_limit_amount: string,
    note: string,
    status: boolean,
    group_id: number,
    id: number,
    amount: string
}

export interface accountsCreateRequest {
    title: string,
    type: string,
    start_amount: number,
    min_amount: number,
    credit_limit_amount: number,
    note: string,
    status: boolean,
    group_id: number,
}

export interface accountsCreateResponse {
    status: string,
    data: accountsData
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

export type accountEditRequesData = accountsCreateRequest








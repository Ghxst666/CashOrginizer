export type PaymentType = 'expenses' | 'profits' | 'transfers'

export type PaymentAmount = number | string | null

export interface CreatePaymentRequest {
    payment_date: string
    purpose_id?: number | null
    amount?: PaymentAmount
    type?: PaymentType | null
    to_account_id?: number | null
    note?: string | null
    category_id?: number | null
    project_id?: number | null
    number?: string | null
    account_id: number
}

export interface EditPaymentRequest {
    payment_date?: string | null
    purpose_id?: number | null
    amount?: PaymentAmount
    type?: PaymentType | null
    to_account_id?: number | null
    note?: string | null
    category_id?: number | null
    project_id?: number | null
    number?: string | null
    account_id?: number | null
    splits_ids?: number[]
}

export interface ExportPaymentsToCsvRequest {
    accounts_ids?: number[]
    date_from?: string | null
    date_to?: string | null
}

export interface ImportPaymentsFromCsvRequest {
    file: File
}

export interface EditManyPaymentsRequest {
    payments_ids: number[]
    data: EditPaymentRequest
}

export type DeleteManyPaymentsRequest = number[]

export interface PaymentListItemResponse {
    Test: string
}

export type GetAllPaymentsResponse = PaymentListItemResponse[]

export interface CreatePaymentResponse {
    Test: string
}

export interface ImportPaymentsFromCsvResponse {
    Test: string
}

export interface ExportPaymentsToCsvResponse {
    Test: string
}

export interface GetPaymentOneOrNoneResponse {
    Test: string
}

export interface EditPaymentResponse {
    Test: string
}

export interface DeletePaymentResponse {
    Test: string
}

export type GetPaymentFilteredByAccountResponse = PaymentListItemResponse[]

export type GetPaymentFilteredByGroupResponse = PaymentListItemResponse[]

export interface DeleteManyPaymentsResponse {
    Test: string
}

export interface EditManyPaymentsResponse {
    Test: string
}

export type PaymentType = 'expenses' | 'profits' | 'transfers'

export type PaymentAmount = string | null

export interface GetPaymentsRequest {
    page?: number
    per_page?: number
    status?: boolean
}

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

export interface PaymentSplitResponse {
    id: number
    note: string
    amount?: PaymentAmount
    project_id?: number | null
}

export interface PaymentResponse {
    payment_date?: string | null
    purpose_id?: number | null
    amount?: PaymentAmount
    type?: PaymentType | null
    to_account_id?: number | null
    note?: string | null
    category_id?: number | null
    project_id?: number | null
    number?: string | null
    id: number
    account_id: number
    account_title?: string | null
    to_account_title?: string | null
}

export interface PaymentListItemResponse {
    payment_date?: string | null
    purpose_id?: number | null
    amount?: PaymentAmount
    type?: PaymentType | null
    to_account_id?: number | null
    note?: string | null
    category_id?: number | null
    project_id?: number | null
    number?: string | null
    id: number
    account_id: number
    account_title?: string | null
    category_title: string
    project_title: string
    purpose_title: string
    to_account_title?: string | null
    project?: string | null
    splits?: PaymentSplitResponse[]
}

export type GetAllPaymentsResponse = PaymentListItemResponse[]

export interface CreatePaymentResponse {
    status: string
    data: PaymentResponse
}

export interface PaymentsImportStatsResponse {
    rows_total: number
    rows_imported: number
    rows_failed: number
    rows_limit: number
    accounts_created: number
    purposes_created: number
    categories_created: number
    projects_created: number
    payments_created: number
    splits_created: number
    category_type_conflicts: number
    opening_balances_applied: number
    ignored_columns: string[]
}

export interface PaymentsImportErrorResponse {
    row: number
    error: string
}

export interface PaymentsImportResultResponse {
    stats: PaymentsImportStatsResponse
    errors: PaymentsImportErrorResponse[]
}

export interface ImportPaymentsFromCsvResponse {
    status: string
    data: PaymentsImportResultResponse
}

export type ExportPaymentsToCsvResponse = Blob

export type GetPaymentOneOrNoneResponse = PaymentListItemResponse

export interface EditPaymentResponse {
    status: string
}

export interface DeletePaymentResponse {
    status: string
}

export type GetPaymentFilteredByAccountResponse = PaymentListItemResponse[]

export type GetPaymentFilteredByGroupResponse = PaymentListItemResponse[]

export interface DeleteManyPaymentsResponse {
    status: string
}

export interface EditManyPaymentsResponse {
    status: string
}

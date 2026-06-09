export type PaymentSplitAmount = string | null

export interface CreatePaymentSplitRequest {
    note?: string | null
    amount?: PaymentSplitAmount
    project_id?: number | null
}

export type EditPaymentSplitRequest = Partial<CreatePaymentSplitRequest>

export interface PaymentSplitResponse {
    id: number
    note?: string | null
    amount?: PaymentSplitAmount
    project_id?: number | null
}

export type GetPaymentSplitsResponse = PaymentSplitResponse[]

export interface CreatePaymentSplitResponse {
    status: string
    data: PaymentSplitResponse
}

export interface EditPaymentSplitResponse {
    status: string
}

export interface DeletePaymentSplitResponse {
    status: string
}

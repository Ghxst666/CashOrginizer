import { REQUEST_METHODS } from "@/shared/config/api/request.config"
import { api } from "@/shared/service/api"
import { BaseResponse } from "@/shared/types/api/request"
import { ENDPOINTS } from "../config/payments-split.config"
import {
    CreatePaymentSplitRequest,
    CreatePaymentSplitResponse,
    DeletePaymentSplitResponse,
    EditPaymentSplitRequest,
    EditPaymentSplitResponse,
    GetPaymentSplitsResponse,
} from "../types/payments-split.types"

export const PaymentsSplitService = {
    getPaymentSplits(payment_id: number): BaseResponse<GetPaymentSplitsResponse> {
        return api.makeRequest<GetPaymentSplitsResponse>({
            url: ENDPOINTS.BASE(payment_id),
            method: REQUEST_METHODS.GET,
        })
    },

    createPaymentSplit(payment_id: number, data: CreatePaymentSplitRequest): BaseResponse<CreatePaymentSplitResponse> {
        return api.makeRequest<CreatePaymentSplitResponse>({
            url: ENDPOINTS.BASE(payment_id),
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    editPaymentSplit(payment_id: number, split_id: number, data: EditPaymentSplitRequest): BaseResponse<EditPaymentSplitResponse> {
        return api.makeRequest<EditPaymentSplitResponse>({
            url: ENDPOINTS.DETAIL(payment_id, split_id),
            method: REQUEST_METHODS.PARTIAL_UPDATE,
            data,
        })
    },

    deletePaymentSplit(payment_id: number, split_id: number): BaseResponse<DeletePaymentSplitResponse> {
        return api.makeRequest<DeletePaymentSplitResponse>({
            url: ENDPOINTS.DETAIL(payment_id, split_id),
            method: REQUEST_METHODS.DELETE,
        })
    },
}

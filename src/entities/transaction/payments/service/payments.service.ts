import { REQUEST_METHODS } from "@/shared/config/api/request.config";
import { api } from "@/shared/service/api";
import { BaseResponse } from "@/shared/types/api/request";
import { ENDPOINTS } from "../config/payments.config";
import {
    CreatePaymentRequest,
    CreatePaymentResponse,
    DeleteManyPaymentsRequest,
    DeleteManyPaymentsResponse,
    DeletePaymentResponse,
    EditManyPaymentsRequest,
    EditManyPaymentsResponse,
    EditPaymentRequest,
    EditPaymentResponse,
    ExportPaymentsToCsvRequest,
    ExportPaymentsToCsvResponse,
    GetAllPaymentsResponse,
    GetPaymentFilteredByAccountResponse,
    GetPaymentFilteredByGroupResponse,
    GetPaymentOneOrNoneResponse,
    ImportPaymentsFromCsvRequest,
    ImportPaymentsFromCsvResponse,
} from "../types/payments.types";

export const PaymentsService = {
    getAllPayments(): BaseResponse<GetAllPaymentsResponse> {
        return api.makeRequest<GetAllPaymentsResponse>({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.GET,
        })
    },

    createPayment(data: CreatePaymentRequest): BaseResponse<CreatePaymentResponse> {
        return api.makeRequest<CreatePaymentResponse>({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    importPaymentsFromCsv(data: ImportPaymentsFromCsvRequest): BaseResponse<ImportPaymentsFromCsvResponse> {
        const formData = new FormData()

        formData.append('file', data.file)

        return api.makeRequest<ImportPaymentsFromCsvResponse>({
            url: ENDPOINTS.IMPORT_CSV,
            method: REQUEST_METHODS.POST,
            data: formData,
        })
    },

    exportPaymentsToCsv(data: ExportPaymentsToCsvRequest): BaseResponse<ExportPaymentsToCsvResponse> {
        return api.makeRequest<ExportPaymentsToCsvResponse>({
            url: ENDPOINTS.EXPORT_CSV,
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    getPayment(payment_id: number): BaseResponse<GetPaymentOneOrNoneResponse> {
        return api.makeRequest<GetPaymentOneOrNoneResponse>({
            url: `${ENDPOINTS.BASE}/${payment_id}`,
            method: REQUEST_METHODS.GET,
        })
    },

    editPayment(payment_id: number, data: EditPaymentRequest): BaseResponse<EditPaymentResponse> {
        return api.makeRequest<EditPaymentResponse>({
            url: `${ENDPOINTS.BASE}/${payment_id}`,
            method: REQUEST_METHODS.PARTIAL_UPDATE,
            data,
        })
    },

    deletePayment(payment_id: number): BaseResponse<DeletePaymentResponse> {
        return api.makeRequest<DeletePaymentResponse>({
            url: `${ENDPOINTS.BASE}/${payment_id}`,
            method: REQUEST_METHODS.DELETE,
        })
    },

    getPaymentsFilteredByAccount(account_id: number): BaseResponse<GetPaymentFilteredByAccountResponse> {
        return api.makeRequest<GetPaymentFilteredByAccountResponse>({
            url: `${ENDPOINTS.FILTERED_BY_ACCOUNT}/${account_id}`,
            method: REQUEST_METHODS.GET,
        })
    },

    getPaymentsFilteredByGroup(group_id: number): BaseResponse<GetPaymentFilteredByGroupResponse> {
        return api.makeRequest<GetPaymentFilteredByGroupResponse>({
            url: `${ENDPOINTS.FILTERED_BY_GROUP}/${group_id}`,
            method: REQUEST_METHODS.GET,
        })
    },

    deleteManyPayments(data: DeleteManyPaymentsRequest): BaseResponse<DeleteManyPaymentsResponse> {
        return api.makeRequest<DeleteManyPaymentsResponse>({
            url: ENDPOINTS.BULK,
            method: REQUEST_METHODS.DELETE,
            data,
        })
    },

    editManyPayments(data: EditManyPaymentsRequest): BaseResponse<EditManyPaymentsResponse> {
        return api.makeRequest<EditManyPaymentsResponse>({
            url: ENDPOINTS.BULK,
            method: REQUEST_METHODS.PARTIAL_UPDATE,
            data,
        })
    },
}

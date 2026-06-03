import { DefaultError, useMutation, UseMutationReturnType, useQuery, useQueryClient, UseQueryReturnType } from "@tanstack/vue-query";
import { ElMessage } from "element-plus";
import { PaymentsService } from "../service/payments.service";
import {
    CreatePaymentRequest,
    DeleteManyPaymentsRequest,
    EditManyPaymentsRequest,
    EditPaymentRequest,
    ExportPaymentsToCsvRequest,
    GetAllPaymentsResponse,
    GetPaymentFilteredByAccountResponse,
    GetPaymentFilteredByGroupResponse,
    GetPaymentOneOrNoneResponse,
    ImportPaymentsFromCsvRequest,
} from "../types/payments.types";

export function usePaymentsQuery(): UseQueryReturnType<GetAllPaymentsResponse, DefaultError> {
    return useQuery({
        queryKey: ['payments'],
        queryFn: () => PaymentsService.getAllPayments().then(res => res.data),
    })
}

export function useCreatePayment(): UseMutationReturnType<
  any,
  Error,
  CreatePaymentRequest,
  unknown
> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['payments_create'],
        mutationFn: (data: CreatePaymentRequest) => PaymentsService.createPayment(data),
        onSuccess: () => {
            ElMessage.success({
                message: 'Payment created successfully',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Failed to create payment. Try again.',
                plain: true,
            })
        },
    })
}

export function useImportPaymentsFromCsv(): UseMutationReturnType<
  any,
  Error,
  ImportPaymentsFromCsvRequest,
  unknown
> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['payments_import_csv'],
        mutationFn: (data: ImportPaymentsFromCsvRequest) => PaymentsService.importPaymentsFromCsv(data),
        onSuccess: () => {
            ElMessage.success({
                message: 'Payments imported successfully',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Failed to import payments. Try again.',
                plain: true,
            })
        },
    })
}

export function useExportPaymentsToCsv(): UseMutationReturnType<
  any,
  Error,
  ExportPaymentsToCsvRequest,
  unknown
> {
    return useMutation({
        mutationKey: ['payments_export_csv'],
        mutationFn: (data: ExportPaymentsToCsvRequest) => PaymentsService.exportPaymentsToCsv(data),
        onSuccess: () => {
            ElMessage.success({
                message: 'Payments exported successfully',
                plain: true,
            })
        },
        onError: () => {
            ElMessage.error({
                message: 'Failed to export payments. Try again.',
                plain: true,
            })
        },
    })
}

export function usePaymentQuery(payment_id: number): UseQueryReturnType<GetPaymentOneOrNoneResponse, DefaultError> {
    return useQuery({
        queryKey: ['payment', payment_id],
        queryFn: () => PaymentsService.getPayment(payment_id).then(res => res.data),
    })
}

export function usePaymentsFilteredByAccountQuery(account_id: number): UseQueryReturnType<GetPaymentFilteredByAccountResponse, DefaultError> {
    return useQuery({
        queryKey: ['payments', 'account', account_id],
        queryFn: () => PaymentsService.getPaymentsFilteredByAccount(account_id).then(res => res.data),
    })
}

export function usePaymentsFilteredByGroupQuery(group_id: number): UseQueryReturnType<GetPaymentFilteredByGroupResponse, DefaultError> {
    return useQuery({
        queryKey: ['payments', 'group', group_id],
        queryFn: () => PaymentsService.getPaymentsFilteredByGroup(group_id).then(res => res.data),
    })
}

export function useEditPayment(): UseMutationReturnType<
  any,
  Error,
  { payment_id: number, data: EditPaymentRequest },
  unknown
> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['payments_edit'],
        mutationFn: (data: { payment_id: number, data: EditPaymentRequest }) => PaymentsService.editPayment(data.payment_id, data.data),
        onSuccess: () => {
            ElMessage.success({
                message: 'Payment updated successfully',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Failed to update payment. Try again.',
                plain: true,
            })
        },
    })
}

export function useDeletePayment(): UseMutationReturnType<
  any,
  Error,
  { payment_id: number },
  unknown
> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['payments_delete'],
        mutationFn: (data: { payment_id: number }) => PaymentsService.deletePayment(data.payment_id),
        onSuccess: () => {
            ElMessage.success({
                message: 'Payment deleted successfully',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Failed to delete payment. Try again.',
                plain: true,
            })
        },
    })
}

export function useDeleteManyPayments(): UseMutationReturnType<
  any,
  Error,
  DeleteManyPaymentsRequest,
  unknown
> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['payments_delete_many'],
        mutationFn: (data: DeleteManyPaymentsRequest) => PaymentsService.deleteManyPayments(data),
        onSuccess: () => {
            ElMessage.success({
                message: 'Payments deleted successfully',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Failed to delete payments. Try again.',
                plain: true,
            })
        },
    })
}

export function useEditManyPayments(): UseMutationReturnType<
  any,
  Error,
  EditManyPaymentsRequest,
  unknown
> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['payments_edit_many'],
        mutationFn: (data: EditManyPaymentsRequest) => PaymentsService.editManyPayments(data),
        onSuccess: () => {
            ElMessage.success({
                message: 'Payments updated successfully',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Failed to update payments. Try again.',
                plain: true,
            })
        },
    })
}

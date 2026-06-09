import { DefaultError, useMutation, UseMutationReturnType, useQuery, useQueryClient, UseQueryReturnType } from "@tanstack/vue-query"
import { ElMessage } from "element-plus"
import { PaymentsSplitService } from "../service/payments-split.service"
import {
    CreatePaymentSplitRequest,
    EditPaymentSplitRequest,
    GetPaymentSplitsResponse,
} from "../types/payments-split.types"

export function usePaymentSplitsQuery(payment_id: number): UseQueryReturnType<GetPaymentSplitsResponse, DefaultError> {
    return useQuery({
        queryKey: ['payments', payment_id, 'splits'],
        queryFn: () => PaymentsSplitService.getPaymentSplits(payment_id).then(res => res.data),
    })
}

export function useCreatePaymentSplit(): UseMutationReturnType<
    any,
    Error,
    { payment_id: number, data: CreatePaymentSplitRequest },
    unknown
> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['payment_split_create'],
        mutationFn: (data: { payment_id: number, data: CreatePaymentSplitRequest }) => PaymentsSplitService.createPaymentSplit(data.payment_id, data.data),
        onSuccess: (_, variables) => {
            ElMessage.success({
                message: 'Сплит успешно создан',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            queryClient.invalidateQueries({ queryKey: ['payments', variables.payment_id, 'splits'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Не получилось создать сплит. Попробуйте еще раз.',
                plain: true,
            })
        },
    })
}

export function useEditPaymentSplit(): UseMutationReturnType<
    any,
    Error,
    { payment_id: number, split_id: number, data: EditPaymentSplitRequest },
    unknown
> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['payment_split_edit'],
        mutationFn: (data: { payment_id: number, split_id: number, data: EditPaymentSplitRequest }) => PaymentsSplitService.editPaymentSplit(data.payment_id, data.split_id, data.data),
        onSuccess: (_, variables) => {
            ElMessage.success({
                message: 'Сплит успешно отредактирован',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            queryClient.invalidateQueries({ queryKey: ['payments', variables.payment_id, 'splits'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Не получилось отредактировать сплит. Попробуйте еще раз.',
                plain: true,
            })
        },
    })
}

export function useDeletePaymentSplit(): UseMutationReturnType<
    any,
    Error,
    { payment_id: number, split_id: number },
    unknown
> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['payment_split_delete'],
        mutationFn: (data: { payment_id: number, split_id: number }) => PaymentsSplitService.deletePaymentSplit(data.payment_id, data.split_id),
        onSuccess: (_, variables) => {
            ElMessage.success({
                message: 'Сплит успешно удален',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            queryClient.invalidateQueries({ queryKey: ['payments', variables.payment_id, 'splits'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Не получилось удалить сплит. Попробуйте еще раз.',
                plain: true,
            })
        },
    })
}

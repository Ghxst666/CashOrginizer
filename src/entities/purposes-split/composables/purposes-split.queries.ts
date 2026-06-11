import { DefaultError, useMutation, UseMutationReturnType, useQuery, useQueryClient, UseQueryReturnType } from "@tanstack/vue-query"
import { ElMessage } from "element-plus"
import { PurposesSplitService } from "../service/purposes-split.service"
import {
    CreatePurposeSplitRequest,
    EditPurposeSplitRequest,
    GetPurposeSplitsResponse,
    PurposeSplitResponse,
} from "../types/purposes-split.types"

const purposeSplitsQueryKey = (purpose_id: number) => ['purposes', purpose_id, 'splits'] as const

export function usePurposeSplitsQuery(purpose_id: number): UseQueryReturnType<GetPurposeSplitsResponse, DefaultError> {
    return useQuery({
        queryKey: purposeSplitsQueryKey(purpose_id),
        queryFn: () => PurposesSplitService.getPurposeSplits(purpose_id).then(res => res.data),
    })
}

export function usePurposeSplitQuery(purpose_id: number, split_id: number): UseQueryReturnType<PurposeSplitResponse, DefaultError> {
    return useQuery({
        queryKey: [...purposeSplitsQueryKey(purpose_id), split_id],
        queryFn: () => PurposesSplitService.getPurposeSplit(purpose_id, split_id).then(res => res.data),
    })
}

export function useCreatePurposeSplit(): UseMutationReturnType<
    any,
    Error,
    { purpose_id: number, data: CreatePurposeSplitRequest },
    unknown
> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['purpose_split_create'],
        mutationFn: data => PurposesSplitService.createPurposeSplit(data.purpose_id, data.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['purposes'] })
            queryClient.invalidateQueries({ queryKey: purposeSplitsQueryKey(variables.purpose_id) })
        },
        onError: () => ElMessage.error({ message: 'Не удалось создать сплит названия.', plain: true }),
    })
}

export function useEditPurposeSplit(): UseMutationReturnType<
    any,
    Error,
    { purpose_id: number, split_id: number, data: EditPurposeSplitRequest },
    unknown
> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['purpose_split_edit'],
        mutationFn: data => PurposesSplitService.editPurposeSplit(data.purpose_id, data.split_id, data.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['purposes'] })
            queryClient.invalidateQueries({ queryKey: purposeSplitsQueryKey(variables.purpose_id) })
        },
        onError: () => ElMessage.error({ message: 'Не удалось отредактировать сплит названия.', plain: true }),
    })
}

export function useDeletePurposeSplit(): UseMutationReturnType<
    any,
    Error,
    { purpose_id: number, split_id: number },
    unknown
> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['purpose_split_delete'],
        mutationFn: data => PurposesSplitService.deletePurposeSplit(data.purpose_id, data.split_id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['purposes'] })
            queryClient.invalidateQueries({ queryKey: purposeSplitsQueryKey(variables.purpose_id) })
        },
        onError: () => ElMessage.error({ message: 'Не удалось удалить сплит названия.', plain: true }),
    })
}

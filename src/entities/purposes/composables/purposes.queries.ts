import { DefaultError, useMutation, UseMutationReturnType, useQuery, useQueryClient, UseQueryReturnType } from "@tanstack/vue-query";
import { ElMessage } from "element-plus";
import { ENDPOINTS } from "../config/purposes.config";
import { PurposesService } from "../service/purposes.service";
import { createPurposesData, ItemPurposesResponseData, purposesRequest, purposesResponseData, updatePurposesData } from "../types/purposes.types";
import { computed, unref, type MaybeRef } from "vue";

export function usePurposesQuery(
  params: MaybeRef<Partial<purposesRequest> | undefined> = undefined,
): UseQueryReturnType<purposesResponseData, DefaultError> {
    return useQuery({
        queryKey: computed(() => [ENDPOINTS.PURPOSES, unref(params)]),
        queryFn: () => PurposesService.getAllPurposes(unref(params)).then(res => res.data)
    })
}

export function usePurposesItemQuery(purpose_id: number): UseQueryReturnType<ItemPurposesResponseData, DefaultError> {
    return useQuery({
        queryKey: ['item_purposes'],
        queryFn: () => PurposesService.getPurposesItem(purpose_id).then(res => res.data)
    })
}

export function useCreatePurposes(): UseMutationReturnType<
  Awaited<ReturnType<typeof PurposesService.createPurposes>>,
  Error,
  createPurposesData,
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['purposes_create'],
    mutationFn: (data: createPurposesData) => PurposesService.createPurposes(data),
    onSuccess: () => {
      ElMessage.success({
        message: 'Название успешно создано',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.PURPOSES] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось создать Название. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

export function useDeletePurposes(): UseMutationReturnType<
  any,
  Error,
  { purpose_id: number },
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['purposes_delete'],
    mutationFn: (data: { purpose_id: number }) => PurposesService.deletePurposes(data.purpose_id),
    onSuccess: () => {
      ElMessage.success({
        message: 'Название успешно удалено',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.PURPOSES] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось удалить Название. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

export function useUpdatePurposes(): UseMutationReturnType<
  any,
  Error,
  { data: updatePurposesData, purpose_id : number },
  unknown
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['purposes_update'],
    mutationFn: (data: { data: updatePurposesData, purpose_id: number }) => PurposesService.updatePurposes(data.purpose_id, data.data),
    onSuccess: () => {
      ElMessage.success({
        message: 'Название успешно редактировано',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.PURPOSES] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось редактировать Название. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

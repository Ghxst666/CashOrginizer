import { DefaultError, useMutation, UseMutationReturnType, useQuery, useQueryClient, UseQueryReturnType } from "@tanstack/vue-query";
import { CreateTagRequestData, TagsResponse } from "../types/tags.types";
import { ENDPOINTS } from "../config/tags.config";
import { TagsService } from "../service/tags.service";
import { ElMessage } from "element-plus";

export function useTagsQuery(): UseQueryReturnType<TagsResponse, DefaultError> {
    return useQuery({
        queryKey: [ENDPOINTS.BASE],
        queryFn: () => TagsService.getAllTags().then(res => res.data)
    })
}

export function useCreateTag(): UseMutationReturnType<
  any,
  Error,
  CreateTagRequestData,
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['services_create'],
    mutationFn: (data: CreateTagRequestData) => TagsService.addTag(data),
    onSuccess: () => {
      ElMessage.success({
        message: 'Тег успешно создан',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.BASE] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось создать тег. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}
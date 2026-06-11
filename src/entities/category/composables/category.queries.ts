import { DefaultError, useMutation, UseMutationReturnType, useQuery, useQueryClient, UseQueryReturnType } from "@tanstack/vue-query";
import { ElMessage } from "element-plus";
import { CategoryRequest, CategoryResponseData, CreateCategoryData } from "../types/category.types";
import { ENDPOINTS } from "../config/category.config";
import { CategoryService } from "../service/category.service";
import { computed, unref, type MaybeRef } from "vue";

export function useCategoriesQuery(
  params: MaybeRef<Partial<CategoryRequest> | undefined> = undefined,
  enabled: MaybeRef<boolean> = true,
): UseQueryReturnType<CategoryResponseData, DefaultError> {
    return useQuery({
        queryKey: computed(() => [ENDPOINTS.BASE, unref(params)]),
        queryFn: () => CategoryService.getAllCategories(unref(params)).then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function useCreateCategory(): UseMutationReturnType<
  any,
  Error,
  CreateCategoryData,
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['category_create'],
    mutationFn: (data: CreateCategoryData) => CategoryService.createCategory(data),
    onSuccess: () => {
      ElMessage.success({
        message: 'Категория успешно создана',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.BASE] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось создать Категорию. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

export function useDeleteCategory(): UseMutationReturnType<
  any,
  Error,
  { category_id: number },
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['category_delete'],
    mutationFn: (data: { category_id: number }) => CategoryService.deleteCategory(data.category_id),
    onSuccess: () => {
      ElMessage.success({
        message: 'Категория успешно удалена',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.BASE] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось удалить Категорию. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

export function useUpdateCategory(): UseMutationReturnType<
  any,
  Error,
  { data: CreateCategoryData, category_id: number },
  unknown
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['category_update'],
    mutationFn: (data: { data: CreateCategoryData, category_id: number }) => CategoryService.updateCategory(data.category_id, data.data),
    onSuccess: () => {
      ElMessage.success({
        message: 'Категория успешно редактирована',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.BASE] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось редактировать Категорию. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

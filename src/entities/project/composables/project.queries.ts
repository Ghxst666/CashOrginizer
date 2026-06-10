import { DefaultError, useMutation, UseMutationReturnType, useQuery, useQueryClient, UseQueryReturnType } from "@tanstack/vue-query";
import { ElMessage } from "element-plus";
import { ENDPOINTS } from "../config/project.config";
import { projectCreateData, projectsResponseData } from "../types/project.types";
import { ProjectService } from "../service/project.service";
import { computed, unref, type MaybeRef } from "vue";
import type { projectsRequest } from "../types/project.types";

export function useProjectsQuery(
    params: MaybeRef<Partial<projectsRequest> | undefined> = undefined,
): UseQueryReturnType<projectsResponseData, DefaultError> {
    return useQuery({
        queryKey: computed(() => [ENDPOINTS.PROJECT, unref(params)]),
        queryFn: () => ProjectService.getAllProject(unref(params)).then(res => res.data)
    })
}

export function useCreateProject(): UseMutationReturnType<
  any,
  Error,
  projectCreateData,
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['project_create'],
    mutationFn: (data: projectCreateData) => ProjectService.createProject(data),
    onSuccess: () => {
      ElMessage.success({
        message: 'Проект успешно создана',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.PROJECT] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось создать Проект. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

export function useDeleteProject(): UseMutationReturnType<
  any,
  Error,
  { project_id: number },
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['project_delete'],
    mutationFn: (data: { project_id: number }) => ProjectService.deleteProject(data.project_id),
    onSuccess: () => {
      ElMessage.success({
        message: 'Проект успешно удален',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.PROJECT] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось удалить Проект. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

export function useUpdateProject(): UseMutationReturnType<
  any,
  Error,
  { data: projectCreateData, project_id : number },
  unknown
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['project_update'],
    mutationFn: (data: { data: projectCreateData, project_id: number }) => ProjectService.updateProject(data.project_id, data.data),
    onSuccess: () => {
      ElMessage.success({
        message: 'Проект успешно редактирована',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.PROJECT] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось редактировать Проект. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

import { DefaultError, useMutation, UseMutationReturnType, useQuery, useQueryClient, UseQueryReturnType } from "@tanstack/vue-query";
import { createGroupsRequest, groupsResponse } from "../types/groups.types";
import { GroupService } from "../service/groups.service";
import { ElMessage } from "element-plus";
import { computed, unref, type MaybeRef } from "vue";

export function useGroupsQuery(enabled: MaybeRef<boolean> = true): UseQueryReturnType<groupsResponse[], DefaultError> {
    return useQuery({
        queryKey: ['groups'],
        queryFn: () => GroupService.getAllGroups().then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function useCreateGroup(): UseMutationReturnType<
  any,
  Error,
  createGroupsRequest,
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['groups_create'],
    mutationFn: (data: createGroupsRequest) => GroupService.createGroup(data),
    onSuccess: () => {
      ElMessage.success({
        message: 'Группа успешно создана',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось создать группу. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

export function useEditGroup(): UseMutationReturnType<
  any,
  Error,
  { group_id: number, data: createGroupsRequest },
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['groups_edit'],
    mutationFn: (data: { group_id: number, data: createGroupsRequest }) => GroupService.editGroup(data.group_id, data.data),
    onSuccess: () => {
      ElMessage.success({
        message: 'Группа успешно отредактировано',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось отредактировать группу. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

export function useDeleteGroup(): UseMutationReturnType<
  any,
  Error,
  { group_id: number },
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['groups_delete'],
    mutationFn: (data: { group_id: number }) => GroupService.deleteGroup(data.group_id),
    onSuccess: () => {
      ElMessage.success({
        message: 'Группа успешно удалена',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось удалить группу. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

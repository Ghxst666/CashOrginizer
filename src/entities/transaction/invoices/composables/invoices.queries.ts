import { DefaultError, useMutation, UseMutationReturnType, useQuery, useQueryClient, UseQueryReturnType } from "@tanstack/vue-query";
import { InvoicessService } from "../service/invoices.service";
import { accountEditRequesData, accountPartialEditItemRequestData, accountsCreateRequest, accountsGroupItemResponse, accountsResponse, accountsSortedByGroupsResponse, accountsSortedByTypeResponse, accountUserItemResponse } from "../types/invoices.types";
import { ElMessage } from "element-plus";
import { computed, unref, type MaybeRef } from "vue";

export function useAccountsQuery(
    status?: MaybeRef<boolean | undefined>,
    enabled: MaybeRef<boolean> = true,
): UseQueryReturnType<accountsResponse[], DefaultError> {
    return useQuery({
        queryKey: computed(() => ['Accounts', unref(status)]),
        queryFn: () => InvoicessService.getAllInvoices(unref(status)).then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function useFilteredInvoicesByType(
    status?: MaybeRef<boolean | undefined>,
    enabled: MaybeRef<boolean> = true,
): UseQueryReturnType<accountsSortedByTypeResponse[], DefaultError> {
    return useQuery({
        queryKey: computed(() => ['Accounts', 'by_type', unref(status)]),
        queryFn: () => InvoicessService.getAllInvoicesSortedByType(unref(status)).then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function useFilteredInvoicesByGroups(
    status?: MaybeRef<boolean | undefined>,
    enabled: MaybeRef<boolean> = true,
): UseQueryReturnType<accountsSortedByGroupsResponse[], DefaultError> {
    return useQuery({
        queryKey: computed(() => ['Accounts', 'by_groups', unref(status)]),
        queryFn: () => InvoicessService.getAllInvoicesSortedByGroups(unref(status)).then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function useCreateAccount(): UseMutationReturnType<
  any,
  Error,
  accountsCreateRequest,
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['Accounts_create'],
    mutationFn: (data: accountsCreateRequest) => InvoicessService.createInvoices(data),
    onSuccess: () => {
      ElMessage.success({
        message: 'Счет успешно создан',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: ['Accounts'] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось создать Счет. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

export function useAccountsItemGroup(group_id: number, status?: boolean): UseQueryReturnType<accountsGroupItemResponse, DefaultError> {
    return useQuery({
        queryKey: ['get_Accounts_Itemgroup'],
        queryFn: () => InvoicessService.accountsItemGroup(group_id, status).then(res => res.data)
    })
}

export function useAccountItem(account_id: number): UseQueryReturnType<accountUserItemResponse, DefaultError> {
    return useQuery({
        queryKey: ['get_Accounts_Item'],
        queryFn: () => InvoicessService.accountItem(account_id).then(res => res.data)
    })
}

export function useAccountItemWithGroup(group_id: number,account_id: number): UseQueryReturnType<accountUserItemResponse, DefaultError> {
    return useQuery({
        queryKey: ['get_Accounts_ItemWithGroup'],
        queryFn: () => InvoicessService.accountItemWithGroup(group_id, account_id).then(res => res.data)
    })
}

export function useAccountsPartialEdit(): UseMutationReturnType<
  any,
  Error,
  { data: accountPartialEditItemRequestData, group_id: number, account_id: number },
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['partial_update'],
    mutationFn: (data: { data: accountPartialEditItemRequestData, group_id: number, account_id: number }) => InvoicessService.accountsPartialEdit(data.group_id, data.account_id, data.data),
    onSuccess: () => {
      ElMessage.success({
        message: 'Счет успешно отредактирован',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: ['Accounts'] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось отредактировать Счет. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

export function useAccountsEdit(): UseMutationReturnType<
  any,
  Error,
  { data: accountEditRequesData, account_id: number },
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['update'],
    mutationFn: (data: { data: accountEditRequesData, account_id: number }) => InvoicessService.accountsEdit(data.account_id, data.data),
    onSuccess: () => {
      ElMessage.success({
        message: 'Счет успешно отредактирован',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: ['Accounts'] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось отредактировать Счет. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

export function useDeleteWithGroup(): UseMutationReturnType<
  any,
  Error,
  { group_id: number, account_id: number },
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['account_delete_WithGrop'],
    mutationFn: (data: { group_id: number, account_id: number }) => InvoicessService.accountsDeleteWithGroup(data.group_id, data.account_id),
    onSuccess: () => {
      ElMessage.success({
        message: 'Счет успешно удален',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: ['Accounts'] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось удалить Счет. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

export function useDelete(): UseMutationReturnType<
  any,
  Error,
  { account_id: number },
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['account_delete'],
    mutationFn: (data: { account_id: number }) => InvoicessService.accountsDelete(data.account_id),
    onSuccess: () => {
      ElMessage.success({
        message: 'Счет успешно удален',
        plain: true,
      })
      queryClient.invalidateQueries({ queryKey: ['Accounts'] })
    },
    onError: () => {
      ElMessage.error({
        message: 'Не удалось удалить Счет. Попробуйте ещё раз.',
        plain: true,
      })
    },
  })
}

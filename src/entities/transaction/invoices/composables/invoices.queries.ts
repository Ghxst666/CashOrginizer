import { DefaultError, useMutation, UseMutationReturnType, useQuery, useQueryClient, UseQueryReturnType } from "@tanstack/vue-query";
import { InvoicessService } from "../service/invoices.service";
import { accountEditRequesData, accountPartialEditItemRequestData, accountsCreateRequest, accountsGroupItemResponse, accountsResponse, accountsSortedByGroupsResponse, accountsSortedByStatusResponse, accountsSortedByTypeResponse, accountUserItemResponse } from "../types/invoices.types";
import { ElMessage } from "element-plus";

const queryClient = useQueryClient()

export function useAccountsQuery(): UseQueryReturnType<accountsResponse, DefaultError> {
    return useQuery({
        queryKey: ['Accounts'],
        queryFn: () => InvoicessService.getAllInvoices().then(res => res.data)
    })
}

export function useCreateAccount(): UseMutationReturnType<
  any,
  Error,
  accountsCreateRequest,
  unknown
> {
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

export function useFilteredInvoicesByStatus(status: boolean): UseQueryReturnType<accountsSortedByStatusResponse, DefaultError> {
    return useQuery({
        queryKey: ['Accounts_status'],
        queryFn: () => InvoicessService.filteredInvoicesByStatus(status).then(res => res.data)
    })
}

export function useFilteredInvoicesByType(status: boolean): UseQueryReturnType<accountsSortedByTypeResponse, DefaultError> {
    return useQuery({
        queryKey: ['Accounts_type'],
        queryFn: () => InvoicessService.filteredInvoicesByType(status).then(res => res.data)
    })
}

export function useFilteredInvoicesByGroups(status: boolean): UseQueryReturnType<accountsSortedByGroupsResponse, DefaultError> {
    return useQuery({
        queryKey: ['Accounts_group'],
        queryFn: () => InvoicessService.filteredInvoicesByGroups(status).then(res => res.data)
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
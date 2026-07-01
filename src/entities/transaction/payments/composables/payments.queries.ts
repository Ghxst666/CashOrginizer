import { DefaultError, InfiniteData, useInfiniteQuery, UseInfiniteQueryReturnType, useMutation, UseMutationReturnType, useQuery, useQueryClient, UseQueryReturnType } from "@tanstack/vue-query";
import { ElMessage } from "element-plus";
import { useInfiniteScroll } from "@/shared/composables/useInfiniteScroll";
import { PaymentsService } from "../service/payments.service";
import { computed, unref, type MaybeRef } from "vue";
import {
    CreatePaymentRequest,
    DeleteManyPaymentsRequest,
    EditManyPaymentsRequest,
    EditPaymentRequest,
    ExportPaymentsToCsvRequest,
    GetAllPaymentsResponse,
    GetPaymentFilteredByAccountResponse,
    GetPaymentFilteredByCategoryResponse,
    GetPaymentFilteredByGroupResponse,
    GetPaymentFilteredByProjectResponse,
    GetPaymentFilteredByPurposeResponse,
    GetPaymentOneOrNoneResponse,
    ImportPaymentsFromCsvRequest,
} from "../types/payments.types";

const DEFAULT_PAYMENTS_PER_PAGE = 30

export type PaymentsRemoteFilterType = 'account' | 'group' | 'purpose' | 'project' | 'category'

type UsePaymentsInfiniteScrollQueryReturn = UseInfiniteQueryReturnType<InfiniteData<GetAllPaymentsResponse, number>, DefaultError> & ReturnType<typeof useInfiniteScroll>

export function usePaymentsQuery(
    enabled: MaybeRef<boolean> = true,
): UseQueryReturnType<GetAllPaymentsResponse, DefaultError> {
    return useQuery({
        queryKey: ['payments'],
        queryFn: () => PaymentsService.getAllPayments().then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function usePaymentsInfiniteScrollQuery(
    perPage = DEFAULT_PAYMENTS_PER_PAGE,
    enabled: MaybeRef<boolean> = true,
): UsePaymentsInfiniteScrollQueryReturn {
    const query = useInfiniteQuery<GetAllPaymentsResponse, DefaultError, InfiniteData<GetAllPaymentsResponse, number>, readonly ['payments', 'infinite', number], number>({
        queryKey: ['payments', 'infinite', perPage],
        queryFn: ({ pageParam }) => PaymentsService.getAllPayments({
            page: pageParam,
            per_page: perPage,
        }).then(res => res.data),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => lastPage.length === perPage ? allPages.length + 1 : undefined,
        enabled: computed(() => unref(enabled)),
    })

    const { target } = useInfiniteScroll(query.fetchNextPage, query.hasNextPage, query.isFetchingNextPage)

    return {
        ...query,
        target,
    }
}

export function usePaymentsFilteredInfiniteScrollQuery(
    filterType: MaybeRef<PaymentsRemoteFilterType>,
    filterId: MaybeRef<number>,
    perPage = DEFAULT_PAYMENTS_PER_PAGE,
    enabled: MaybeRef<boolean> = true,
): UsePaymentsInfiniteScrollQueryReturn {
    const query = useInfiniteQuery<GetAllPaymentsResponse, DefaultError, InfiniteData<GetAllPaymentsResponse, number>, readonly unknown[], number>({
        queryKey: computed(() => ['payments', 'filtered', unref(filterType), unref(filterId), perPage]),
        queryFn: ({ pageParam }) => getPaymentsFilteredByType(unref(filterType), unref(filterId), {
            page: pageParam,
            per_page: perPage,
        }).then(res => res.data),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => lastPage.length === perPage ? allPages.length + 1 : undefined,
        enabled: computed(() => unref(enabled) && Number.isFinite(unref(filterId)) && unref(filterId) > 0),
    })

    const { target } = useInfiniteScroll(query.fetchNextPage, query.hasNextPage, query.isFetchingNextPage)

    return {
        ...query,
        target,
    }
}

function getPaymentsFilteredByType(
    filterType: PaymentsRemoteFilterType,
    filterId: number,
    params: { page: number, per_page: number },
) {
    if (filterType === 'account') return PaymentsService.getPaymentsFilteredByAccount(filterId, params)
    if (filterType === 'group') return PaymentsService.getPaymentsFilteredByGroup(filterId, params)
    if (filterType === 'purpose') return PaymentsService.getPaymentsFilteredByPurpose(filterId, params)
    if (filterType === 'project') return PaymentsService.getPaymentsFilteredByProject(filterId, params)

    return PaymentsService.getPaymentsFilteredByCategory(filterId, params)
}

function usePaymentsFilteredByIdInfiniteScrollQuery(
    queryKeyPart: string,
    filterId: MaybeRef<number>,
    fetcher: (filterId: number, params: { page: number, per_page: number, status?: boolean }) => ReturnType<typeof PaymentsService.getPaymentsFilteredByAccount>,
    perPage = DEFAULT_PAYMENTS_PER_PAGE,
    enabled: MaybeRef<boolean> = true,
    status?: MaybeRef<boolean | undefined>,
): UsePaymentsInfiniteScrollQueryReturn {
    const query = useInfiniteQuery<GetAllPaymentsResponse, DefaultError, InfiniteData<GetAllPaymentsResponse, number>, readonly unknown[], number>({
        queryKey: computed(() => ['payments', queryKeyPart, 'infinite', unref(filterId), perPage, unref(status)]),
        queryFn: ({ pageParam }) => fetcher(unref(filterId), {
            page: pageParam,
            per_page: perPage,
            status: unref(status),
        }).then(res => res.data),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => lastPage.length === perPage ? allPages.length + 1 : undefined,
        enabled: computed(() => unref(enabled) && Number.isFinite(unref(filterId)) && unref(filterId) > 0),
    })

    const { target } = useInfiniteScroll(query.fetchNextPage, query.hasNextPage, query.isFetchingNextPage)

    return {
        ...query,
        target,
    }
}

export function usePaymentsFilteredByAccountInfiniteScrollQuery(
    account_id: MaybeRef<number>,
    perPage = DEFAULT_PAYMENTS_PER_PAGE,
    enabled: MaybeRef<boolean> = true,
    status?: MaybeRef<boolean | undefined>,
): UsePaymentsInfiniteScrollQueryReturn {
    return usePaymentsFilteredByIdInfiniteScrollQuery('account', account_id, PaymentsService.getPaymentsFilteredByAccount, perPage, enabled, status)
}

export function usePaymentsFilteredByGroupInfiniteScrollQuery(
    group_id: MaybeRef<number>,
    perPage = DEFAULT_PAYMENTS_PER_PAGE,
    enabled: MaybeRef<boolean> = true,
    status?: MaybeRef<boolean | undefined>,
): UsePaymentsInfiniteScrollQueryReturn {
    return usePaymentsFilteredByIdInfiniteScrollQuery('group', group_id, PaymentsService.getPaymentsFilteredByGroup, perPage, enabled, status)
}

export function usePaymentsFilteredByPurposeInfiniteScrollQuery(
    purpose_id: MaybeRef<number>,
    perPage = DEFAULT_PAYMENTS_PER_PAGE,
    enabled: MaybeRef<boolean> = true,
    status?: MaybeRef<boolean | undefined>,
): UsePaymentsInfiniteScrollQueryReturn {
    return usePaymentsFilteredByIdInfiniteScrollQuery('purpose', purpose_id, PaymentsService.getPaymentsFilteredByPurpose, perPage, enabled, status)
}

export function usePaymentsFilteredByProjectInfiniteScrollQuery(
    project_id: MaybeRef<number>,
    perPage = DEFAULT_PAYMENTS_PER_PAGE,
    enabled: MaybeRef<boolean> = true,
    status?: MaybeRef<boolean | undefined>,
): UsePaymentsInfiniteScrollQueryReturn {
    return usePaymentsFilteredByIdInfiniteScrollQuery('project', project_id, PaymentsService.getPaymentsFilteredByProject, perPage, enabled, status)
}

export function usePaymentsFilteredByCategoryInfiniteScrollQuery(
    category_id: MaybeRef<number>,
    perPage = DEFAULT_PAYMENTS_PER_PAGE,
    enabled: MaybeRef<boolean> = true,
    status?: MaybeRef<boolean | undefined>,
): UsePaymentsInfiniteScrollQueryReturn {
    return usePaymentsFilteredByIdInfiniteScrollQuery('category', category_id, PaymentsService.getPaymentsFilteredByCategory, perPage, enabled, status)
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
                message: 'Платеж успешно создан',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            queryClient.invalidateQueries({ queryKey: ['Accounts'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Не получилось создать платеж. Попробуйте еще раз.',
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
                message: 'Платежи успешно импортированы',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            queryClient.invalidateQueries({ queryKey: ['Accounts'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Не получилось импортировать платеж. Попробуйте еще раз',
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
        onSuccess: (response) => {
            const url = URL.createObjectURL(response.data as unknown as Blob)
            const link = document.createElement('a')

            link.href = url
            link.download = 'payments.qif'
            link.click()
            URL.revokeObjectURL(url)

            ElMessage.success({
                message: 'Платежи успешно экспортированы',
                plain: true,
            })
        },
        onError: () => {
            ElMessage.error({
                message: 'Не получилось экспортировать платеж. Попробуйте еще раз',
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

export function usePaymentsFilteredByAccountQuery(
    account_id: MaybeRef<number>,
    enabled: MaybeRef<boolean> = true,
    status: MaybeRef<boolean> = true,
): UseQueryReturnType<GetPaymentFilteredByAccountResponse, DefaultError> {
    return useQuery({
        queryKey: computed(() => ['payments', 'account', unref(account_id), unref(status)]),
        queryFn: () => PaymentsService.getPaymentsFilteredByAccount(unref(account_id), { status: unref(status) }).then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function usePaymentsFilteredByGroupQuery(
    group_id: MaybeRef<number>,
    enabled: MaybeRef<boolean> = true,
    status: MaybeRef<boolean> = true,
): UseQueryReturnType<GetPaymentFilteredByGroupResponse, DefaultError> {
    return useQuery({
        queryKey: computed(() => ['payments', 'group', unref(group_id), unref(status)]),
        queryFn: () => PaymentsService.getPaymentsFilteredByGroup(unref(group_id), { status: unref(status) }).then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function usePaymentsFilteredByPurposeQuery(
    purpose_id: MaybeRef<number>,
    enabled: MaybeRef<boolean> = true,
    status: MaybeRef<boolean> = true,
): UseQueryReturnType<GetPaymentFilteredByPurposeResponse, DefaultError> {
    return useQuery({
        queryKey: computed(() => ['payments', 'purpose', unref(purpose_id), unref(status)]),
        queryFn: () => PaymentsService.getPaymentsFilteredByPurpose(unref(purpose_id), { status: unref(status) }).then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function usePaymentsFilteredByProjectQuery(
    project_id: MaybeRef<number>,
    enabled: MaybeRef<boolean> = true,
    status: MaybeRef<boolean> = true,
): UseQueryReturnType<GetPaymentFilteredByProjectResponse, DefaultError> {
    return useQuery({
        queryKey: computed(() => ['payments', 'project', unref(project_id), unref(status)]),
        queryFn: () => PaymentsService.getPaymentsFilteredByProject(unref(project_id), { status: unref(status) }).then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function usePaymentsFilteredByCategoryQuery(
    category_id: MaybeRef<number>,
    enabled: MaybeRef<boolean> = true,
    status: MaybeRef<boolean> = true,
): UseQueryReturnType<GetPaymentFilteredByCategoryResponse, DefaultError> {
    return useQuery({
        queryKey: computed(() => ['payments', 'category', unref(category_id), unref(status)]),
        queryFn: () => PaymentsService.getPaymentsFilteredByCategory(unref(category_id), { status: unref(status) }).then(res => res.data),
        enabled: computed(() => unref(enabled)),
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
                message: 'Платеж успешно отредактирован',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            queryClient.invalidateQueries({ queryKey: ['Accounts'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Не получилось отредактировать платеж. Попробуйте еще раз.',
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
                message: 'Платеж успшено удален',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            queryClient.invalidateQueries({ queryKey: ['Accounts'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Не получилось удалить платеж. Попробуйте еще раз.',
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
                message: 'Платежи успшено удалены',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            queryClient.invalidateQueries({ queryKey: ['Accounts'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Не получилось удалить платежи. Попробуйте еще раз.',
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
                message: 'Плтежи отредактированы успешно.',
                plain: true,
            })
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            queryClient.invalidateQueries({ queryKey: ['Accounts'] })
        },
        onError: () => {
            ElMessage.error({
                message: 'Не получилось отредактировать платежи. Попробуйте еще раз.',
                plain: true,
            })
        },
    })
}

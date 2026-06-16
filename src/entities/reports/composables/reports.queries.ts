import { DefaultError, useQuery, UseQueryReturnType } from "@tanstack/vue-query";
import { computed, unref, type MaybeRef } from "vue";
import { ENDPOINTS } from "../config/reports.config";
import { ReportsService } from "../service/reports.service";
import {
    CategoriesReportResponseData,
    IncomeExpenseReportResponseData,
    PaymentsReportResponseData,
    ProjectsReportResponseData,
    PurposesReportResponseData,
    ReportsRequest,
} from "../types/reports.types";

export function usePurposesReportQuery(
    data: MaybeRef<ReportsRequest | undefined> = undefined,
    enabled: MaybeRef<boolean> = true,
): UseQueryReturnType<PurposesReportResponseData, DefaultError> {
    return useQuery({
        queryKey: computed(() => [ENDPOINTS.PURPOSES, unref(data)]),
        queryFn: () => ReportsService.getPurposesReport(unref(data)).then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function useCategoriesReportQuery(
    data: MaybeRef<ReportsRequest | undefined> = undefined,
    enabled: MaybeRef<boolean> = true,
): UseQueryReturnType<CategoriesReportResponseData, DefaultError> {
    return useQuery({
        queryKey: computed(() => [ENDPOINTS.CATEGORIES, unref(data)]),
        queryFn: () => ReportsService.getCategoriesReport(unref(data)).then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function useProjectsReportQuery(
    data: MaybeRef<ReportsRequest | undefined> = undefined,
    enabled: MaybeRef<boolean> = true,
): UseQueryReturnType<ProjectsReportResponseData, DefaultError> {
    return useQuery({
        queryKey: computed(() => [ENDPOINTS.PROJECTS, unref(data)]),
        queryFn: () => ReportsService.getProjectsReport(unref(data)).then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function useIncomeExpenseReportQuery(
    data: MaybeRef<ReportsRequest | undefined> = undefined,
    enabled: MaybeRef<boolean> = true,
): UseQueryReturnType<IncomeExpenseReportResponseData, DefaultError> {
    return useQuery({
        queryKey: computed(() => [ENDPOINTS.INCOME_EXPENSE, unref(data)]),
        queryFn: () => ReportsService.getIncomeExpenseReport(unref(data)).then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

export function usePaymentsReportQuery(
    data: MaybeRef<ReportsRequest | undefined> = undefined,
    enabled: MaybeRef<boolean> = true,
): UseQueryReturnType<PaymentsReportResponseData, DefaultError> {
    return useQuery({
        queryKey: computed(() => [ENDPOINTS.PAYMENTS, unref(data)]),
        queryFn: () => ReportsService.getPaymentsReport(unref(data)).then(res => res.data),
        enabled: computed(() => unref(enabled)),
    })
}

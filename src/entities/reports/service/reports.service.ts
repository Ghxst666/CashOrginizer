import { REQUEST_METHODS } from "@/shared/config/api/request.config";
import { api } from "@/shared/service/api";
import { BaseResponse } from "@/shared/types/api/request";
import { ENDPOINTS } from "../config/reports.config";
import {
    CategoriesReportResponseData,
    IncomeExpenseReportResponseData,
    PaymentsReportResponseData,
    ProjectsReportResponseData,
    PurposesReportResponseData,
    ReportsRequest,
} from "../types/reports.types";

export const ReportsService = {
    getPurposesReport(data?: ReportsRequest): BaseResponse<PurposesReportResponseData> {
        return api.makeRequest<PurposesReportResponseData>({
            url: ENDPOINTS.PURPOSES,
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    getCategoriesReport(data?: ReportsRequest): BaseResponse<CategoriesReportResponseData> {
        return api.makeRequest<CategoriesReportResponseData>({
            url: ENDPOINTS.CATEGORIES,
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    getProjectsReport(data?: ReportsRequest): BaseResponse<ProjectsReportResponseData> {
        return api.makeRequest<ProjectsReportResponseData>({
            url: ENDPOINTS.PROJECTS,
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    getIncomeExpenseReport(data?: ReportsRequest): BaseResponse<IncomeExpenseReportResponseData> {
        return api.makeRequest<IncomeExpenseReportResponseData>({
            url: ENDPOINTS.INCOME_EXPENSE,
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    getPaymentsReport(data?: ReportsRequest): BaseResponse<PaymentsReportResponseData> {
        return api.makeRequest<PaymentsReportResponseData>({
            url: ENDPOINTS.PAYMENTS,
            method: REQUEST_METHODS.POST,
            data,
        })
    },
}

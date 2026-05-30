import { BaseResponse } from "@/shared/types/api/request";
import { accountEditRequesData, accountPartialEditItemRequestData, accountsCreateRequest, accountsCreateResponse, accountsGroupItemResponse, accountsResponse, accountsSortedByGroupsResponse, accountsSortedByStatusResponse, accountsSortedByTypeResponse, accountUserItemResponse } from "../types/invoices.types";
import { api } from "@/shared/service/api";
import { ENDPOINTS } from "../config/invoices.config";
import { REQUEST_METHODS } from "@/shared/config/api/request.config";

export const InvoicessService = {
    getAllInvoices(): BaseResponse<accountsResponse[]> {
        return api.makeRequest<accountsResponse[]>({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.GET,
        })
    },

    createInvoices(data: accountsCreateRequest): BaseResponse<accountsCreateResponse> {
        return api.makeRequest<accountsCreateResponse>({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.POST,
            data
        })
    },

    filteredInvoicesByStatus(status: boolean): BaseResponse<accountsSortedByStatusResponse> {
        return api.makeRequest<accountsSortedByStatusResponse>({
            url: `${ENDPOINTS.SORTED_BY_STATUS + '/' + status}`,
            method: REQUEST_METHODS.GET,
        })
    },

    filteredInvoicesByType(status: boolean): BaseResponse<accountsSortedByTypeResponse> {
        return api.makeRequest<accountsSortedByTypeResponse>({
            url: `${ENDPOINTS.SORTED_BY_TYPE + '/' + status}`,
            method: REQUEST_METHODS.GET,
        })
    },

    filteredInvoicesByGroups(status: boolean): BaseResponse<accountsSortedByGroupsResponse> {
        return api.makeRequest<accountsSortedByGroupsResponse>({
            url: `${ENDPOINTS.SORTED_BY_GROUPS + '/' + status}`,
            method: REQUEST_METHODS.GET,
        })
    },

    accountsItemGroup(group_id: number, status?: boolean): BaseResponse<accountsGroupItemResponse> {
        return api.makeRequest<accountsGroupItemResponse>({
            url: `${ENDPOINTS.ACCOUNTS_GROUP_ITEM + '/' + group_id + '/' + status}`,
            method: REQUEST_METHODS.GET
        })
    },

    accountItem(account_id: number): BaseResponse<accountUserItemResponse> {
        return api.makeRequest<accountUserItemResponse> ({
            url: `${ENDPOINTS.ACCOUNT + '/' + account_id}`,
            method: REQUEST_METHODS.GET
        })
    },

    accountItemWithGroup(group_id: number, account_id: number): BaseResponse<accountUserItemResponse> {
        return api.makeRequest<accountUserItemResponse> ({
            url: `${ENDPOINTS.ACCOUNTS_GROUP_ITEM + '/' + group_id + '/account/' + account_id}`,
            method: REQUEST_METHODS.GET
        })
    },

    accountsPartialEdit(group_id: number, account_id: number, data: accountPartialEditItemRequestData): BaseResponse<void> {
        return api.makeRequest<void> ({
            url: `${ENDPOINTS.BASE + '/' + group_id + '/' + account_id}`,
            method: REQUEST_METHODS.PARTIAL_UPDATE,
            data
        })
    },

    accountsEdit(account_id: number, data: accountEditRequesData): BaseResponse<void> {
        return api.makeRequest<void> ({
            url: `${ENDPOINTS.BASE + '/' + account_id}`,
            method: REQUEST_METHODS.PARTIAL_UPDATE,
            data
        })
    },

    accountsDeleteWithGroup(group_id: number, account_id: number): BaseResponse<void> {
        return api.makeRequest<void> ({
            url: `${ENDPOINTS.BASE + '/' + group_id + '/' + account_id}`,
            method: REQUEST_METHODS.DELETE
        })
    },

    accountsDelete(account_id: number): BaseResponse<void> {
        return api.makeRequest<void> ({
            url: `${ENDPOINTS.BASE + '/' + account_id}`,
            method: REQUEST_METHODS.DELETE
        })
    }
}
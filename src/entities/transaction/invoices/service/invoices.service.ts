import { BaseResponse } from "@/shared/types/api/request";
import { accountEditRequesData, accountPartialEditItemRequestData, accountsCreateRequest, accountsCreateResponse, accountsGroupItemResponse, accountsReorderRequest, accountsResponse, accountsSortedByGroupsResponse, accountsSortedByTypeResponse, accountUserItemResponse } from "../types/invoices.types";
import { api } from "@/shared/service/api";
import { ENDPOINTS } from "../config/invoices.config";
import { REQUEST_METHODS } from "@/shared/config/api/request.config";

export const InvoicessService = {
    getAllInvoices(status?: boolean): BaseResponse<accountsResponse[]> {
        return api.makeRequest<accountsResponse[]>({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.GET,
            params: {
                status,
            },
        })
    },

    getAllInvoicesSortedByType(status?: boolean): BaseResponse<accountsSortedByTypeResponse[]> {
        return api.makeRequest<accountsSortedByTypeResponse[]>({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.GET,
            params: {
                status,
                sorted: 'by_type',
            },
        })
    },

    getAllInvoicesSortedByGroups(status?: boolean): BaseResponse<accountsSortedByGroupsResponse[]> {
        return api.makeRequest<accountsSortedByGroupsResponse[]>({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.GET,
            params: {
                status,
                sorted: 'by_groups',
            },
        })
    },

    createInvoices(data: accountsCreateRequest): BaseResponse<accountsCreateResponse> {
        return api.makeRequest<accountsCreateResponse>({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.POST,
            data
        })
    },

    reorderAccounts(data: accountsReorderRequest): BaseResponse<void> {
        return api.makeRequest<void>({
            url: ENDPOINTS.REORDER,
            method: REQUEST_METHODS.PARTIAL_UPDATE,
            data,
        })
    },

    accountsItemGroup(group_id: number, status?: boolean): BaseResponse<accountsGroupItemResponse> {
        return api.makeRequest<accountsGroupItemResponse>({
            url: `${ENDPOINTS.ACCOUNTS_GROUP_ITEM + '/' + group_id}`,
            method: REQUEST_METHODS.GET,
            params: {
                status,
            },
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

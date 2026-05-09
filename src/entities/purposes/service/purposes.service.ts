import { BaseResponse } from "@/shared/types/api/request"
import { api } from "@/shared/service/api"
import { REQUEST_METHODS } from "@/shared/config/api/request.config"
import { ENDPOINTS } from "../config/purposes.config"
import { createPurposesData, ItemPurposesResponseData, purposesRequest, purposesResponseData } from "../types/purposes.types"

export const PurposesService = {
    getAllPurposes(params?: purposesRequest): BaseResponse<purposesResponseData> {
        return api.makeRequest<purposesResponseData>({
            url: ENDPOINTS.PURPOSES,
            method: REQUEST_METHODS.GET,
            params
        })
    },

    getPurposesItem(purpose_id: number): BaseResponse<ItemPurposesResponseData> {
        return api.makeRequest<ItemPurposesResponseData>({
            url: `${ENDPOINTS.BASE + '/' + purpose_id}`,
            method: REQUEST_METHODS.GET,
        })
    },

    createPurposes(data: createPurposesData): BaseResponse<void> {
        return api.makeRequest<void>({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.POST,
            data
        })
    },

    deletePurposes(purpose_id: number): BaseResponse<void> {
        return api.makeRequest<void>({
            url: `${ENDPOINTS.BASE + '/' + purpose_id}`,
            method: REQUEST_METHODS.DELETE,
        })
    },

    updatePurposes(purpose_id: number, data: createPurposesData): BaseResponse<void> {
        return api.makeRequest<void>({
            url: `${ENDPOINTS.BASE + '/' + purpose_id}`,
            method: REQUEST_METHODS.PARTIAL_UPDATE,
            data
        })
    }
}
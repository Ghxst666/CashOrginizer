import { REQUEST_METHODS } from "@/shared/config/api/request.config"
import { api } from "@/shared/service/api"
import { BaseResponse } from "@/shared/types/api/request"
import { ENDPOINTS } from "../config/purposes-split.config"
import {
    CreatePurposeSplitRequest,
    CreatePurposeSplitResponse,
    EditPurposeSplitRequest,
    GetPurposeSplitsResponse,
    PurposeSplitResponse,
    StatusResponse,
} from "../types/purposes-split.types"

export const PurposesSplitService = {
    getPurposeSplits(purpose_id: number): BaseResponse<GetPurposeSplitsResponse> {
        return api.makeRequest<GetPurposeSplitsResponse>({
            url: ENDPOINTS.BASE(purpose_id),
            method: REQUEST_METHODS.GET,
        })
    },

    createPurposeSplit(purpose_id: number, data: CreatePurposeSplitRequest): BaseResponse<CreatePurposeSplitResponse> {
        return api.makeRequest<CreatePurposeSplitResponse>({
            url: ENDPOINTS.BASE(purpose_id),
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    getPurposeSplit(purpose_id: number, split_id: number): BaseResponse<PurposeSplitResponse> {
        return api.makeRequest<PurposeSplitResponse>({
            url: ENDPOINTS.DETAIL(purpose_id, split_id),
            method: REQUEST_METHODS.GET,
        })
    },

    editPurposeSplit(purpose_id: number, split_id: number, data: EditPurposeSplitRequest): BaseResponse<StatusResponse> {
        return api.makeRequest<StatusResponse>({
            url: ENDPOINTS.DETAIL(purpose_id, split_id),
            method: REQUEST_METHODS.PARTIAL_UPDATE,
            data,
        })
    },

    deletePurposeSplit(purpose_id: number, split_id: number): BaseResponse<StatusResponse> {
        return api.makeRequest<StatusResponse>({
            url: ENDPOINTS.DETAIL(purpose_id, split_id),
            method: REQUEST_METHODS.DELETE,
        })
    },
}

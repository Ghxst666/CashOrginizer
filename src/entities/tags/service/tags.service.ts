import { BaseResponse } from "@/shared/types/api/request";
import { CreateTagRequestData, CreateTagResponse, TagsRequest, TagsResponse } from "../types/tags.types";
import { api } from "@/shared/service/api";
import { ENDPOINTS } from "../config/tags.config";
import { REQUEST_METHODS } from "@/shared/config/api/request.config";

export const TagsService = {
    getAllTags(params?: TagsRequest): BaseResponse<TagsResponse> {
        return api.makeRequest<TagsResponse>({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.GET,
            params
        })
    },

    addTag(data: CreateTagRequestData): BaseResponse<CreateTagResponse> {
        return api.makeRequest<CreateTagResponse>({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.POST,
            data
        })
    }
}
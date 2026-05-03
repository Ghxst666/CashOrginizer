import { BaseResponse } from "@/shared/types/api/request";
import { CreateTagRequestData, CreateTagResponse, DeleteTagResponse, TagsRequest, TagsResponse } from "../types/tags.types";
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
            url: ENDPOINTS.CREATE,
            method: REQUEST_METHODS.POST,
            data
        })
    },

    deleteTag(tag_id: string): BaseResponse<DeleteTagResponse> {
        return api.makeRequest<DeleteTagResponse>({
            url: `${ENDPOINTS.CREATE + '/' + tag_id}`,
            method: REQUEST_METHODS.DELETE,
        })
    },

    updateTag(tag_id: string, data: CreateTagRequestData): BaseResponse<void> {
        return api.makeRequest<void>({
            url: `${ENDPOINTS.CREATE + '/' + tag_id}`,
            method: REQUEST_METHODS.PARTIAL_UPDATE,
            data
        })
    }
}
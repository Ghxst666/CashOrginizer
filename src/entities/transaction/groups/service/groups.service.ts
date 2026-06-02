import { BaseResponse } from "@/shared/types/api/request";
import { createGroupsRequest, groupsResponse } from "../types/groups.types";
import { api } from "@/shared/service/api";
import { ENDPOINTS } from "../config/groups.config";
import { REQUEST_METHODS } from "@/shared/config/api/request.config";

export const GroupService = {
    getAllGroups(): BaseResponse<groupsResponse[]> {
        return api.makeRequest<groupsResponse[]> ({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.GET
        })
    },
    createGroup(data: createGroupsRequest): BaseResponse<void> {
        return api.makeRequest<void> ({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.POST,
            data
        })
    },
    editGroup(group_id: number, data: createGroupsRequest): BaseResponse<void> {
        return api.makeRequest<void> ({
            url: `${ENDPOINTS.BASE}/${group_id}`,
            method: REQUEST_METHODS.PARTIAL_UPDATE,
            data
        })
    },
    deleteGroup(group_id: number): BaseResponse<void> {
        return api.makeRequest<void> ({
            url: `${ENDPOINTS.BASE}/${group_id}`,
            method: REQUEST_METHODS.DELETE
        })
    }
}
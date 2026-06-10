import { BaseResponse } from "@/shared/types/api/request"
import { projectCreateData, projectsRequest, projectsResponseData } from "../types/project.types"
import { api } from "@/shared/service/api"
import { ENDPOINTS } from "../config/project.config"
import { REQUEST_METHODS } from "@/shared/config/api/request.config"

export const ProjectService = {
    getAllProject(params?: Partial<projectsRequest>): BaseResponse<projectsResponseData> {
        return api.makeRequest<projectsResponseData>({
            url: ENDPOINTS.PROJECT,
            method: REQUEST_METHODS.GET,
            params
        })
    },

    createProject(data: projectCreateData): BaseResponse<void> {
        return api.makeRequest<void>({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.POST,
            data
        })
    },

    deleteProject(project_id: number): BaseResponse<void> {
        return api.makeRequest<void>({
            url: `${ENDPOINTS.BASE + '/' + project_id}`,
            method: REQUEST_METHODS.DELETE,
        })
    },

    updateProject(project_id: number, data: projectCreateData): BaseResponse<void> {
        return api.makeRequest<void>({
            url: `${ENDPOINTS.BASE + '/' + project_id}`,
            method: REQUEST_METHODS.PARTIAL_UPDATE,
            data
        })
    }
}

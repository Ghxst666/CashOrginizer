import { BaseResponse } from "@/shared/types/api/request"
import { CategoryRequest, CategoryResponseData, CreateCategoryData } from "../types/category.types"
import { api } from "@/shared/service/api"
import { ENDPOINTS } from "../config/category.config"
import { REQUEST_METHODS } from "@/shared/config/api/request.config"

export const CategoryService = {
    getAllCategories(params?: CategoryRequest): BaseResponse<CategoryResponseData> {
        return api.makeRequest<CategoryResponseData>({
            url: ENDPOINTS.BASE,
            method: REQUEST_METHODS.GET,
            params
        })
    },

    createCategory(data: CreateCategoryData): BaseResponse<void> {
        return api.makeRequest<void>({
            url: ENDPOINTS.CREATE,
            method: REQUEST_METHODS.POST,
            data
        })
    },

    deleteCategory(category_id: number): BaseResponse<void> {
        return api.makeRequest<void>({
            url: `${ENDPOINTS.CREATE + '/' + category_id}`,
            method: REQUEST_METHODS.DELETE,
        })
    },

    updateCategory(category_id: number, data: CreateCategoryData): BaseResponse<void> {
        return api.makeRequest<void>({
            url: `${ENDPOINTS.CREATE + '/' + category_id}`,
            method: REQUEST_METHODS.PARTIAL_UPDATE,
            data
        })
    }
}
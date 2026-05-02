import { ApiErrorResponse } from "@/shared/types/api/error"
import { AxiosError } from "axios"
import { ElMessage } from "element-plus"

export function errorMessageHandler(error: AxiosError<ApiErrorResponse>) {
  if (typeof error.response?.data.detail === 'string') {
    ElMessage({
      message: error.response?.data?.detail,
      type: 'error',
      placement: 'top-right',
    })
  }
  if (Array.isArray(error.response?.data.detail)) {
    error.response?.data.detail.forEach((error) => {
      ElMessage({
        message: error.msg,
        type: 'error',
        placement: 'top-right',
      })
    })
  }
}
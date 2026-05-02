export interface ApiValidationError {
  loc: (number | string)[]
  msg: string
  type: string
}

export interface ApiErrorResponse {
  detail: ApiValidationError[] | string
}

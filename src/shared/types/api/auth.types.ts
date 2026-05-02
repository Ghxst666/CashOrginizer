export interface LoginRequestData {
    login: string
    password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
}

export interface RefreshResponse {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
}
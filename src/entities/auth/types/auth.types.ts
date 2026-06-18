export interface RegisterRequestData {
    nickname: string
    email: string
    password: string
}

export interface RecoveryCodesResponse {
    recovery_codes: string[]
}

export interface ResetPasswordRequestData {
    code: string
    new_password: string
}

export interface RecoveryCodesReissueRequestData {
    current_password: string
}

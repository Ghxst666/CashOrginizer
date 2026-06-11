export interface CreatePurposeSplitRequest {
    note: string
    amount: string
    project_id?: number | null
}

export interface EditPurposeSplitRequest {
    note?: string | null
    amount?: string | null
    project_id?: number | null
}

export interface PurposeSplitResponse {
    purpose_id: number
    note: string
    amount: string | null
    project_id: number | null
    id: number
    project_title?: string | null
}

export type GetPurposeSplitsResponse = PurposeSplitResponse[]

export interface CreatePurposeSplitResponse {
    status: string
    data: PurposeSplitResponse
}

export interface StatusResponse {
    status: string
}

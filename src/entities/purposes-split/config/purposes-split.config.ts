export const ENDPOINTS = {
    BASE: (purpose_id: number) => `purposes/${purpose_id}/splits`,
    DETAIL: (purpose_id: number, split_id: number) => `purposes/${purpose_id}/splits/${split_id}`,
} as const

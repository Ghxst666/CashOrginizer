export const ENDPOINTS = {
    BASE: (payment_id: number) => `payments/${payment_id}/splits`,
    DETAIL: (payment_id: number, split_id: number) => `payments/${payment_id}/splits/${split_id}`,
} as const

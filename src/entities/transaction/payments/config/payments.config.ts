export const ENDPOINTS = {
    BASE: 'payments',
    IMPORT_CSV: 'payments/import/qif',
    EXPORT_CSV: 'payments/export/qif',
    FILTERED_BY_ACCOUNT: 'payments/accounts',
    FILTERED_BY_GROUP: 'payments/groups',
    BULK: 'payments/',
} as const

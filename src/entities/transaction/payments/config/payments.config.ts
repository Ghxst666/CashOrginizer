export const ENDPOINTS = {
    BASE: 'payments',
    IMPORT_CSV: 'payments/import/qif',
    EXPORT_CSV: 'payments/export/qif',
    FILTERED_BY_ACCOUNT: 'payments/accounts',
    FILTERED_BY_GROUP: 'payments/groups',
    FILTERED_BY_PURPOSE: 'payments/purposes',
    FILTERED_BY_PROJECT: 'payments/projects',
    FILTERED_BY_CATEGORY: 'payments/categories',
    BULK: 'payments/',
} as const

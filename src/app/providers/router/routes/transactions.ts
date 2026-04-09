import { RouteRecordRaw } from "vue-router";
import { TRANSACTION_ROUTE } from "../../../../shared/router";

export const TRANSACTION_ROUTES: readonly RouteRecordRaw[] = [
    {
        path: TRANSACTION_ROUTE.BASE.PATH,
        name: TRANSACTION_ROUTE.BASE.NAME,
        redirect: { name: TRANSACTION_ROUTE.INVOICES.NAME },
        children: [
            {
                path: TRANSACTION_ROUTE.INVOICES.PATH,
                name: TRANSACTION_ROUTE.INVOICES.NAME,
                component: () => import('@/pages/transactions/invoices/ui/InvoicesPage.vue'),
            },
            {
                path: TRANSACTION_ROUTE.PAYMENTS.PATH,
                name: TRANSACTION_ROUTE.PAYMENTS.NAME,
                component: () => import('@/pages/transactions/payments/ui/PaymentsPage.vue'),
            }
        ]
    }
]
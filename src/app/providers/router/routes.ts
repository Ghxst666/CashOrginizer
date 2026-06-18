import { RouteRecordRaw } from "vue-router";
import { TRANSACTION_ROUTE } from "../../../shared/router";
import MainLayout from "../../../widgets/layouts/MainLayout.vue";
import { TRANSACTION_ROUTES } from "./routes/transactions";
import { INFORMATION_ROUTES } from "./routes/information";
import { AUTH_ROUTES } from "./routes/auth";

const publicRoutes: RouteRecordRaw[] = [
  ...AUTH_ROUTES,
]

const protectedRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: { name: TRANSACTION_ROUTE.BASE.NAME },
        component: MainLayout,
        children: [
            ...TRANSACTION_ROUTES,
            ...INFORMATION_ROUTES
        ],
    },
]

export const routes: readonly RouteRecordRaw[] = [
    ...publicRoutes,
    ...protectedRoutes
]

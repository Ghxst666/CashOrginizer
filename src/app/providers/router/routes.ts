import { RouteRecordRaw } from "vue-router";
import { SYSTEM_ROUTES } from "./routes/system";
import { SYSTEM_ROUTE } from "../../../shared/router";
import MainLayout from "../../../widgets/layouts/MainLayout.vue";
import { TRANSACTION_ROUTES } from "./routes/transactions";
import { PLANNING_ROUTES } from "./routes/planning";
import { INFORMATION_ROUTES } from "./routes/information";
import { AUTH_ROUTES } from "./routes/auth";

const publicRoutes: RouteRecordRaw[] = [
  ...AUTH_ROUTES,
]

const protectedRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: { name: SYSTEM_ROUTE.BASE.NAME },
        component: MainLayout,
        children: [
            ...SYSTEM_ROUTES,
            ...TRANSACTION_ROUTES,
            ...PLANNING_ROUTES,
            ...INFORMATION_ROUTES
        ],
    },
]

export const routes: readonly RouteRecordRaw[] = [
    ...publicRoutes,
    ...protectedRoutes
]
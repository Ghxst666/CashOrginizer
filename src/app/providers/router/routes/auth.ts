import { AUTH_ROUTE } from "@/shared/router";
import { RouteRecordRaw } from "vue-router";
import { requireGuest } from "../guard";

export const AUTH_ROUTES: readonly RouteRecordRaw[] = [
  {
    path: AUTH_ROUTE.BASE.PATH,
    name: AUTH_ROUTE.BASE.NAME,
    redirect: { name: AUTH_ROUTE.LOGIN.NAME },
    children: [
      {
        path: AUTH_ROUTE.LOGIN.PATH,
        name: AUTH_ROUTE.LOGIN.NAME,
        component: () => import('@/pages/auth/AuthPage.vue'),
        beforeEnter: requireGuest,
      },
      {
        path: AUTH_ROUTE.REGISTER.PATH,
        name: AUTH_ROUTE.REGISTER.NAME,
        component: () => import('@/pages/auth/RegistryPage.vue'),
        beforeEnter: requireGuest,
      },
      {
        path: AUTH_ROUTE.RESET_PASSWORD.PATH,
        name: AUTH_ROUTE.RESET_PASSWORD.NAME,
        component: () => import('@/pages/auth/ResetPasswordPage.vue'),
        beforeEnter: requireGuest,
      },
    ],
  },
]

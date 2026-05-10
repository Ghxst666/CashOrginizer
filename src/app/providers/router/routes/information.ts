import { RouteRecordRaw } from "vue-router";
import { INFORMATION_ROUTE } from "../../../../shared/router";
import { requireAuth } from "../guard";

export const INFORMATION_ROUTES: readonly RouteRecordRaw[] = [
    {
        path: INFORMATION_ROUTE.BASE.PATH,
        name: INFORMATION_ROUTE.BASE.NAME,
        redirect: { name: INFORMATION_ROUTE.REPORT.NAME },
        children: [
            {
                path: INFORMATION_ROUTE.REPORT.PATH,
                name: INFORMATION_ROUTE.REPORT.NAME,
                component: () => import('@/pages/information/report/ui/ReportPage.vue'),
                beforeEnter: requireAuth,
            },
            {
                path: INFORMATION_ROUTE.CATEGORY.PATH,
                name: INFORMATION_ROUTE.CATEGORY.NAME,
                component: () => import('@/pages/information/category/ui/CategoryPage.vue'),
                beforeEnter: requireAuth,
            },
            {
                path: INFORMATION_ROUTE.PROJECT.PATH,
                name: INFORMATION_ROUTE.PROJECT.NAME,
                component: () => import('@/pages/information/project/ui/ProjectPage.vue'),
                beforeEnter: requireAuth,
            },
            {
                path: INFORMATION_ROUTE.INFORMATION_TITLE.PATH,
                name: INFORMATION_ROUTE.INFORMATION_TITLE.NAME,
                component: () => import('@/pages/information/informationTitle/ui/InformationTitlePage.vue'),
                beforeEnter: requireAuth,
            },
            {
                path: INFORMATION_ROUTE.TAG.PATH,
                name: INFORMATION_ROUTE.TAG.NAME,
                component: () => import('@/pages/information/tag/ui/TagPage.vue'),
                beforeEnter: requireAuth,
            },
            {
                path: INFORMATION_ROUTE.USER.PATH,
                name: INFORMATION_ROUTE.USER.NAME,
                component: () => import('@/pages/information/user/ui/UserPage.vue'),
                beforeEnter: requireAuth,
            },
        ]
    }
]
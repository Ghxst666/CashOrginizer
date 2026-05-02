import { RouteRecordRaw } from "vue-router";
import { SYSTEM_ROUTE } from "../../../../shared/router";
import { requireAuth } from "../guard";

export const SYSTEM_ROUTES: readonly RouteRecordRaw[] = [
    {
        path: SYSTEM_ROUTE.BASE.PATH,
        name: SYSTEM_ROUTE.BASE.NAME,
        redirect: { name: SYSTEM_ROUTE.SYSTEM_PAGE.NAME },
        children: [
            {
                path: SYSTEM_ROUTE.SYSTEM_PAGE.PATH,
                name: SYSTEM_ROUTE.SYSTEM_PAGE.NAME,
                component: () => import('@/pages/system/SystemPage.vue'),
                beforeEnter: requireAuth,
            }
        ]
    }
]
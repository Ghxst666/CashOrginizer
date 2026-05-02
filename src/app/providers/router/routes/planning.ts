import { RouteRecordRaw } from "vue-router";
import { PLANNING_ROUTE } from "../../../../shared/router";
import { requireAuth } from "../guard";

export const PLANNING_ROUTES: readonly RouteRecordRaw[] = [
    {
        path: PLANNING_ROUTE.BASE.PATH,
        name: PLANNING_ROUTE.BASE.NAME,
        redirect: { name: PLANNING_ROUTE.PLAN.NAME },
        children: [
            {
                path: PLANNING_ROUTE.PLAN.PATH,
                name: PLANNING_ROUTE.PLAN.NAME,
                component: () => import('@/pages/planning/plan/ui/PlanPage.vue'),
                beforeEnter: requireAuth,
            },
            {
                path: PLANNING_ROUTE.BUDGET.PATH,
                name: PLANNING_ROUTE.BUDGET.NAME,
                component: () => import('@/pages/planning/budget/ui/BudgetPage.vue'),
                beforeEnter: requireAuth,
            }
        ]
    }
]
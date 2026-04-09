import { INFORMATION_ROUTE, PLANNING_ROUTE, SYSTEM_ROUTE, TRANSACTION_ROUTE } from "../../../../shared/router";
import { MenuItem } from "../types/menu.types";
import { Monitor, WalletFilled, Notebook, BellFilled } from '@element-plus/icons-vue';

export const menuItems: MenuItem[] = [
    {
        id: '1',
        icon: Monitor,
        title: "Главный экран",
        pageName: SYSTEM_ROUTE.BASE.NAME,
    },
    {
        id: '2',
        icon: WalletFilled,
        title: "Операции",
        children: [
            {
                id: '2-1',
                title: "Счета",
                pageName: TRANSACTION_ROUTE.INVOICES.NAME,
            },
            {
                id: '2-2',
                title: "Платежи",
                pageName: TRANSACTION_ROUTE.PAYMENTS.NAME
            },
        ],
    },
    {
        id: '3',
        icon: BellFilled,
        title: "Планирование",
        children: [
            {
                id: '3-1',
                title: "План",
                pageName: PLANNING_ROUTE.PLAN.NAME,
            },
            {
                id: '3-2',
                title: "Бюджет",
                pageName: PLANNING_ROUTE.BUDGET.NAME
            },
        ],
    },
    {
        id: '4',
        icon: Notebook,
        title: "Информация",
        children: [
            {
                id: '4-1',
                title: "Отчет",
                pageName: INFORMATION_ROUTE.REPORT.NAME,
            },
            {
                id: '4-2',
                title: "Категория",
                pageName: INFORMATION_ROUTE.CATEGORY.NAME
            },
            {
                id: '4-3',
                title: "Проект",
                pageName: INFORMATION_ROUTE.PROJECT.NAME
            },
            {
                id: '4-4',
                title: "Название",
                pageName: INFORMATION_ROUTE.INFORMATION_TITLE.NAME
            },
            {
                id: '4-5',
                title: "Тег",
                pageName: INFORMATION_ROUTE.TAG.NAME
            },
            {
                id: '4-6',
                title: "Валюта",
                pageName: INFORMATION_ROUTE.CURRENCY.NAME
            },
            {
                id: '4-7',
                title: "Пользователь",
                pageName: INFORMATION_ROUTE.USER.NAME
            },
        ],
    },
]
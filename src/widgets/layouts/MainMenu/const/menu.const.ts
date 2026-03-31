import { MenuItem } from "../types/menu.types";
import { Monitor, WalletFilled, Notebook, BellFilled } from '@element-plus/icons-vue';

export const menuItems: MenuItem[] = [
    {
        id: '1',
        icon: Monitor,
        title: "Главный экран",
    },
    {
        id: '2',
        icon: WalletFilled,
        title: "Операции",
        children: [
            {
                id: '2-1',
                title: "Счета",
                pageName: "Счета",
            },
            {
                id: '2-2',
                title: "Платежи",
                pageName: "Платежи"
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
                pageName: "План",
            },
            {
                id: '3-2',
                title: "Бюджет",
                pageName: "Бюджет"
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
                pageName: "Отчет",
            },
            {
                id: '4-2',
                title: "Категория",
                pageName: "Категория"
            },
            {
                id: '4-3',
                title: "Проект",
                pageName: "Проект"
            },
            {
                id: '4-4',
                title: "Название",
                pageName: "Название"
            },
            {
                id: '4-5',
                title: "Тег",
                pageName: "Тег"
            },
            {
                id: '4-6',
                title: "Валюта",
                pageName: "Валюта"
            },
            {
                id: '4-7',
                title: "Пользователь",
                pageName: "Пользователь"
            },
        ],
    },
]
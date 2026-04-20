<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';


const tableData = [
    {
        name: "Мой бюджет",
        budget: "70 000",
        excecc: "64 000",
        percentage: "10",
        current: "6000",
        children: [
            {
                name: "Авто & Транспорт",
                budget: "50 000",
                excecc: "44 000",
                percentage: "10",
                current: "6000",
            },
            {
                name: "Дети",
                budget: "0",
                excecc: "0",
                current: "0",
            },
            {
                name: "Дом",
                budget: "0",
                excecc: "0",
                current: "0",
            },
            {
                name: "Дети",
                budget: "0",
                excecc: "0",
                current: "0",
            },
            {
                name: "Дом",
                budget: "0",
                excecc: "0",
                current: "0",
            },
            {
                name: "Дети",
                budget: "0",
                excecc: "0",
                current: "0",
            },
            {
                name: "Дом",
                budget: "0",
                excecc: "0",
                current: "0",
            },
            {
                name: "Дети",
                budget: "0",
                excecc: "0",
                current: "0",
            },
            {
                name: "Дом",
                budget: "0",
                excecc: "0",
                current: "0",
            },
            {
                name: "Домашние животные",
                budget: "0",
                excecc: "0",
                current: "0",
            },
            {
                name: "Еда и Кафе",
                budget: "0",
                excecc: "0",
                current: "0",
                children: [
                    {
                        name: "Продукты питания",
                        budget: "0",
                        excecc: "0",
                        current: "0",
                    },
                    {
                        name: "Ресторан",
                        budget: "0",
                        excecc: "0",
                        current: "0",
                    },
                ]
            },
            {
                name: "Здоровье и Фитнес",
                budget: "0",
                excecc: "0",
                current: "0",
            },
            {
                name: "Коммунальные услуги и связь",
                budget: "0",
                excecc: "0",
                current: "0",
            },
            {
                name: "Развлечения",
                budget: "0",
                excecc: "0",
                current: "0",
            },
            {
                name: "Шоппинг",
                budget: "0",
                excecc: "0",
                current: "0",
                children: [
                    {
                    name: "Одужда",
                    budget: "0",
                    excecc: "0",
                    current: "0",
                    },
                    {
                        name: "Электроника и ПО",
                        budget: "0",
                        excecc: "0",
                        current: "0",
                    },
                ]
            },
        ]
    },
]
</script>

<template>
    <div class="h-full w-full">
        <ElTable 
            height="100%"
            border 
            :data="tableData"
            row-key="name"
            :tree-props="{ children: 'children' }"
        >
            <ElTableColumn prop="name" label="Группы и категории" />
            <ElTableColumn width="300" prop="percentage" label="Текущий">
                <template #default="{ row }">
                    <ElProgress
                        :text-inside="true"
                        :stroke-width="20"
                        :percentage="row.percentage"
                        status="success"
                    >
                        <span>{{ row.current }}</span>
                    </ElProgress>
                </template>
            </ElTableColumn>
            <ElTableColumn width="300" prop="budget" label="Бюджет" />
            <ElTableColumn width="200" prop="excecc" label="Превыш. / Остаток" />

            <ElTableColumn
                width="140px"
                align="center"
            >
                <ElButton type="primary" :icon="EditPen" />
                <ElButton type="danger" :icon="Delete" />
            </ElTableColumn>
        </ElTable>
    </div>
</template>
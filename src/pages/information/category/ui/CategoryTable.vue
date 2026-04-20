<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElButton, ElText } from 'element-plus';


const tableData = [
    {
        name: "Авто & Транспорт",
        typeCategory: "Расходные",
        Period: "-500",
        children: [
            {
                name: "Автомойка",
                typeCategory: "Расходные",
                Period: "",
            },
            {
                name: "Авторемонт и запчасти",
                typeCategory: "Расходные",
                Period: "",
            },
            {
                name: "Автостраховка",
                typeCategory: "Расходные",
                Period: "",
            },
            {
                name: "Газ и топливо",
                typeCategory: "Расходные",
                Period: "",
            },
            {
                name: "Общественный транспорт",
                typeCategory: "Расходные",
                Period: "",
            },
            {
                name: "Стоянка",
                typeCategory: "Расходные",
                Period: "",
            },
        ]
    },
    {
        name: "Доходы",
        typeCategory: "Приходные",
        Period: "",
        children: [
            {
                name: "Возврат покупки",
                typeCategory: "Приходные",
                Period: "",
            },
            {
                name: "Денежные компенсации",
                typeCategory: "Приходные",
                Period: "",
            },
            {
                name: "Доход от аренды",
                typeCategory: "Приходные",
                Period: "",
            },
            {
                name: "Зарплата и премия",
                typeCategory: "Приходные",
                Period: "",
            },
            {
                name: "Процент от вложений",
                typeCategory: "Приходные",
                Period: "",
            },
        ]
    },
    {
        name: "Доходы",
        typeCategory: "Приходные",
        Period: "",
        children: [
            {
                name: "Возврат покупки",
                typeCategory: "Приходные",
                Period: "",
            },
            {
                name: "Денежные компенсации",
                typeCategory: "Приходные",
                Period: "",
            },
            {
                name: "Доход от аренды",
                typeCategory: "Приходные",
                Period: "",
            },
            {
                name: "Зарплата и премия",
                typeCategory: "Приходные",
                Period: "",
            },
            {
                name: "Процент от вложений",
                typeCategory: "Приходные",
                Period: "",
            },
            {
                name: "Возврат покупки",
                typeCategory: "Приходные",
                Period: "",
            },
            {
                name: "Денежные компенсации",
                typeCategory: "Приходные",
                Period: "",
            },
            {
                name: "Доход от аренды",
                typeCategory: "Приходные",
                Period: "",
            },
            {
                name: "Зарплата и премия",
                typeCategory: "Приходные",
                Period: "",
            },
            {
                name: "Процент от вложений",
                typeCategory: "Приходные",
                Period: "",
            },
        ]
    }
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
            <ElTableColumn prop="name" label="Название категории" />
            <ElTableColumn width="300" prop="typeCategory" label="Тип">
                <template #default="{ row }">
                    <ElText :type="row.typeCategory === 'Расходные' ? 'danger' : 'success'">
                        {{ row.typeCategory }}
                    </ElText>
                </template>
            </ElTableColumn>
            <ElTableColumn width="300" prop="Period" label="Операция" />

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
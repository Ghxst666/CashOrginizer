<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue';


const tableData = [
    {
        status: "Нет статуса",
        date: "21.11.2026",
        name: "jopa",
        sum: "200",
        shablon: "шаблон 1",
    },
    {
        status: "Активный",
        date: "25.05.2026",
        name: "jopa2",
        sum: "300",
        shablon: "шаблон 1",
    },
    {
        status: "Не активный",
        date: "21.08.2026",
        name: "jopa3",
        sum: "450",
        shablon: "шаблон 2",
    },
]
</script>

<template>
    <div class="h-full w-full">
        <ElTable height="100%" border :data="tableData">
            <ElTableColumn width="130" prop="status" label="Статус">
                <ElSelect>
                    
                </ElSelect>
            </ElTableColumn>
            <ElTableColumn width="100" prop="date" label="След. дата" />
            <ElTableColumn prop="name" label="Имя" />
            <ElTableColumn width="100" prop="shablon" label="Шаблон" />
            <ElTableColumn width="100" prop="sum" label="Сумма" />

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

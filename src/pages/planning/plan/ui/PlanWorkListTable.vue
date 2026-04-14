<script setup lang="ts">
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue';


const tableData = [
    {
        status: "Активный",
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
            <ElTableColumn width="70" prop="status" label="Статус">
                <template #default="{ row }">
                    <ElIcon size="20" color="green" v-if="row.status === 'Активный'">
                        <CircleCheckFilled />
                    </ElIcon>
                    <ElIcon size="20" color="red" v-if="row.status === 'Не активный'">
                        <CircleCloseFilled />
                    </ElIcon>
                </template>
            </ElTableColumn>
            <ElTableColumn width="100" prop="date" label="След. дата" />
            <ElTableColumn prop="name" label="Имя" />
            <ElTableColumn width="100" prop="shablon" label="Шаблон" />
            <ElTableColumn width="100" prop="sum" label="Сумма" />
        </ElTable>
    </div>
</template>

<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue';


const tableData = [
    {
        status: "Нет статуса",
        date: "21.11.2026",
        account: "счет 1",
        project: "",
    },
    {
        status: "Чистый",
        date: "25.05.2026",
        account: "счет 2",
        project: "",
    },
    {
        status: "Согласованный",
        date: "21.08.2026",
        account: "счет 3",
        project: "проект",
    },
]
</script>

<template>
    <div style="height: calc(100vh - 113px);">
        <ElTable height="100%" border :data="tableData">
            <ElTableColumn width="100" prop="date" label="Дата" />
            <ElTableColumn prop="account" label="Счет" />
            <ElTableColumn prop="project" label="Проект" />
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

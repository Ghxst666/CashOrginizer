<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';


const tableData = [
    {
        name: "Название 1",
        category: "Авто % Транспорт",
        Period: "-5 000",
    },
    {
        name: "Название 2",
        category: "",
        Period: "-2 000",
    },
    {
        name: "Название 1",
        category: "Авто % Транспорт",
        Period: "-5 000",
    },
    {
        name: "Название 2",
        category: "",
        Period: "-2 000",
    },
    {
        name: "Название 1",
        category: "Авто % Транспорт",
        Period: "-5 000",
    },
    {
        name: "Название 2",
        category: "",
        Period: "-2 000",
    },
    {
        name: "Название 1",
        category: "Авто % Транспорт",
        Period: "-5 000",
    },
    {
        name: "Название 2",
        category: "",
        Period: "-2 000",
    },
    {
        name: "Название 1",
        category: "Авто % Транспорт",
        Period: "-5 000",
    },
    {
        name: "Название 2",
        category: "",
        Period: "-2 000",
    },
    {
        name: "Название 1",
        category: "Авто % Транспорт",
        Period: "-5 000",
    },
    {
        name: "Название 2",
        category: "",
        Period: "-2 000",
    },
    {
        name: "Название 1",
        category: "Авто % Транспорт",
        Period: "-5 000",
    },
    {
        name: "Название 2",
        category: "",
        Period: "-2 000",
    },
    {
        name: "Название 1",
        category: "Авто % Транспорт",
        Period: "-5 000",
    },
    {
        name: "Название 2",
        category: "",
        Period: "-2 000",
    }
]
</script>

<template>
    <div class="h-full w-full">
        <ElTable 
            height="100%"
            border 
            :data="tableData"
        >
            <ElTableColumn prop="name" label="Название" />
            <ElTableColumn width="400" prop="category" label="Категория" />
            <ElTableColumn width="300" prop="Period" label="Период" />

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
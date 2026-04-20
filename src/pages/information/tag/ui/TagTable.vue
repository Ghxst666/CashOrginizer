<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';


const tableData = [
    {
        name: "Название 1",
        color: "#ff0000",
        Period: "-5 000",
    },
    {
        name: "Название 2",
        color: "#66ff00",
        Period: "-2 000",
    },
    {
        name: "Название 1",
        color: "#0014ff",
        Period: "-5 000",
    },
]
</script>

<template>
    <div class="h-full w-full">
        <ElTable 
            height="100%"
            border 
            :data="tableData"
        >
            <ElTableColumn width="58" prop="name" label="Цвет" align="center">
                <template #default = "{ row }">
                    <div 
                        class="size-7 rounded-md"
                        :style="{ backgroundColor: row.color }"
                    />
                </template>
            </ElTableColumn>
            <ElTableColumn prop="category" label="Тег" />
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
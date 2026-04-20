<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElButton, ElText } from 'element-plus';


const tableData = [
    {
        name: "Проект 1",
        limit: "70 000",
        potracheno: "12 000",
        percentage: "15",
        current: "-6000",
        children: [
            {
                name: "ПодПроект 1",
                limit: "20 000",
                potracheno: "10 000",
                percentage: "50",
                current: "-1000",
            },
        ]
    },
    {
        name: "Проект 2",
        limit: "50 000",
        potracheno: "10 000",
        percentage: "13",
        current: "-6 500",
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
            <ElTableColumn prop="name" label="Название проекта" />
            <ElTableColumn width="300" prop="percentage" label="Текущий" align="center">
                <template #default="{ row }">
                    <ElProgress
                        :text-inside="true"
                        :stroke-width="20"
                        :percentage="row.percentage"
                        status="success"
                    >
                        <span>{{ row.potracheno }} р</span>
                    </ElProgress>
                    <p>
                        Лимит {{ row.limit }} р
                    </p>
                </template>
            </ElTableColumn>
            <ElTableColumn width="300" prop="current" label="Период"> 
                <template #default="{ row }">
                    <ElText type="danger">
                        {{ row.current }} р
                    </ElText>
                </template>
            </ElTableColumn>

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
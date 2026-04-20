<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';


const tableData = [
    {
        name: "Доллар США (USD, $)",
        curs: "80,17512",
        check: false
    },
    {
        name: "Российский Рубль (RUB, р)",
        curs: "",
        check: true
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
            <ElTableColumn prop="check" width="50" align="center">
                <template #default="{ row }">
                    <ElCheckbox disabled v-model="row.check" />
                </template>
            </ElTableColumn>
            <ElTableColumn prop="name" label="Валюта" />
            <ElTableColumn width="300" prop="Period" label="Курс">
                <template #default="{ row }">
                    <span>1 $ = {{ row.curs }} р</span>
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

<style scoped>
:deep(.el-checkbox__label) {
    display: none !important;
}
</style>
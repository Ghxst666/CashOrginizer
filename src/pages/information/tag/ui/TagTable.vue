<script setup lang="ts">
import { TagsResponse } from '@/entities/tags/types/tags.types';
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';

defineProps<{
    data: TagsResponse
}>()

</script>

<template>
    <div class="h-full w-full">
        <ElTable 
            height="100%"
            border 
            :data="data.rows"
        >
            <ElTableColumn width="58" prop="name" label="Цвет" align="center">
                <template #default = "{ row }">
                    <div 
                        class="size-7 rounded-md"
                        :style="{ backgroundColor: row.color }"
                    />
                </template>
            </ElTableColumn>
            <ElTableColumn prop="title" label="Тег" />
            <ElTableColumn width="300" prop="total_formatted" label="Период" />

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
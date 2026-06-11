<script setup lang="ts">
import { useDeletePurposes } from '@/entities/purposes';
import { purposesResponseData, purposesRowData } from '@/entities/purposes/types/purposes.types';
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElButton, ElPopconfirm } from 'element-plus';
import { ref } from 'vue';
import EditPurposeDialog from './EditPurposeDialog.vue';

const props = defineProps<{
    data: purposesResponseData
}>()

const selectedPurpose = ref<purposesRowData | null>(null)
const isOpenEdit = ref(false)
const deletePurpose = useDeletePurposes()

function handleUpdate(row: purposesRowData) {
    selectedPurpose.value = { ...row }
    isOpenEdit.value = true
}

function handleDelete(purpose_id: number) {
    deletePurpose.mutate({ purpose_id })
}

</script>

<template>
    <div class="h-full w-full">
        <EditPurposeDialog
            v-if="selectedPurpose && isOpenEdit"
            :key="selectedPurpose.id"
            v-model="isOpenEdit"
            :purpose="selectedPurpose"
        />

        <ElTable 
            height="100%"
            border 
            :data="props.data.rows"
        >
            <ElTableColumn prop="title" label="Название" />
            <ElTableColumn width="400" prop="category_title" label="Категория" />
            <ElTableColumn width="400" prop="project_title" label="Проект" />
            <ElTableColumn width="300" prop="total_formatted" label="Период" />

            <ElTableColumn
                width="140px"
                align="center"
            >
                <template #default="{ row }">
                    <ElButton type="primary" :icon="EditPen" @click="handleUpdate(row)" />
                    <ElPopconfirm title="Вы хотите удалить название?" width="220">
                        <template #reference>
                            <ElButton type="danger" :icon="Delete" :loading="deletePurpose.isPending.value" />
                        </template>
                        <template #actions="{ cancel }">
                            <ElButton size="small" @click="cancel">Нет</ElButton>
                            <ElButton
                                type="danger"
                                size="small"
                                :loading="deletePurpose.isPending.value"
                                @click="handleDelete(row.id)"
                            >
                                Да
                            </ElButton>
                        </template>
                    </ElPopconfirm>
                </template>
            </ElTableColumn>
        </ElTable>
    </div>
</template>

<script setup lang="ts">
import { purposesResponseData } from '@/entities/purposes/types/purposes.types';
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';

const props = defineProps<{
    data: purposesResponseData
}>()

// const selectedRow = ref<CreateCategoryData>()
// const selectedId = ref<number>()
// const isOpenEdit = ref(false)

// const { mutate } = useDeleteCategory()

// function handleConfirm(id: number) {
//   mutate({
//     category_id: id,
//   })
// }


// function formatedTypeName(name: string) {
//     return name === 'expenses'
//         ? 'Расходные'
//         : 'Приходные'
// }

// function handleUpdate(row: any) {
//     selectedRow.value = { ...row }
//     selectedId.value = row.id
//     isOpenEdit.value = true
// }

</script>

<template>
    <div class="h-full w-full">
        <ElTable 
            height="100%"
            border 
            :data="data.rows"
        >
            <ElTableColumn prop="title" label="Название" />
            <ElTableColumn width="400" prop="category_title" label="Категория" />
            <ElTableColumn width="400" prop="project_title" label="Проект" />
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
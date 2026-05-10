<script setup lang="ts">
import { useDeleteCategory } from '@/entities/category';
import { CategoryResponseData, CreateCategoryData } from '@/entities/category/types/category.types';
import EditCategory from '@/shared/ui/edit/EditCategory.vue';
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElButton, ElPopconfirm, ElText } from 'element-plus';
import { ref } from 'vue';

const props = defineProps<{
    data: CategoryResponseData
}>()

const selectedRow = ref<CreateCategoryData>()
const selectedId = ref<number>()
const isOpenEdit = ref(false)

const { mutate } = useDeleteCategory()

function handleConfirm(id: number) {
  mutate({
    category_id: id,
  })
}


function formatedTypeName(name: string) {
    return name === 'expenses'
        ? 'Расходные'
        : 'Приходные'
}

function handleUpdate(row: any) {
    selectedRow.value = { ...row }
    selectedId.value = row.id
    isOpenEdit.value = true
}
</script>

<template>
    <EditCategory 
        v-model="isOpenEdit"
        title="Редактирование категории"
        :id="selectedId || null"
        :categories="data.rows"
        v-if="selectedRow"
        :update-data="selectedRow"
    />
    <div class="h-full w-full">
        <ElTable 
            height="100%"
            border 
            :data="data.rows"
            row-key="id"
            :tree-props="{ children: 'children' }"
        >
            <ElTableColumn prop="title" label="Название категории" />
            <ElTableColumn width="300" prop="type" label="Тип">
                <template #default="{ row }">
                    <ElText :type="row.type === 'expenses' ? 'danger' : 'success'">
                        {{ formatedTypeName(row.type) }}
                    </ElText>
                </template>
            </ElTableColumn>
            <ElTableColumn width="300" prop="total_formatted" label="Операция" />

            <ElTableColumn
            
                width="140px"
                align="center"
            >
                <template #default="{ row }">
                    <ElButton type="primary" @click="handleUpdate(row)" :icon="EditPen" />
                    <ElPopconfirm
                        width="220"
                        :icon="undefined"
                        title="Вы хотите удалить категорию?"
                    >
                        <template #reference>
                            <ElButton type="danger" :icon="Delete" />
                        </template>

                        <template #actions="{ cancel }">
                            <ElButton size="small" @click="cancel">Нет</ElButton>
                            <ElButton type="danger" size="small" @click="handleConfirm(row.id)">Да</ElButton>
                        </template>
                    </ElPopconfirm>
                </template>
            </ElTableColumn>
        </ElTable>
    </div>
</template>
<script setup lang="ts">
import { useDeleteTag } from '@/entities/tags';
import { CreateTagRequestData, TagsResponse } from '@/entities/tags/types/tags.types';
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';
import EditTagDialog from '@/shared/ui/EditTagDialog.vue';
import { ref } from 'vue';

const isOpenEdit = ref(false)
const selectedTag = ref<CreateTagRequestData>()
const selectedId = ref<string>('')

const props = defineProps<{
    data: TagsResponse
}>()

const { mutate } = useDeleteTag()

function handleConfirm(id: string) {
  mutate({
    tag_id: id,
  })
}

function handleUpdate(row: any) {
    selectedTag.value = { ...row }
    selectedId.value = row.id
    isOpenEdit.value = true
}

</script>

<template>
    <EditTagDialog 
        v-model="isOpenEdit"
        title="Редактирование тега"
        v-if="selectedTag"
        :update-data="selectedTag"
        :id="selectedId"
    />
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
                <template #default="{ row }">
                    <ElButton type="primary" @click="handleUpdate(row)" :icon="EditPen" />
                    <ElPopconfirm
                        width="220"
                        :icon="undefined"
                        title="Вы хотите удалить счет?"
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
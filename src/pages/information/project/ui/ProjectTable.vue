<script setup lang="ts">
import { useDeleteProject } from '@/entities/project';
import { projectCreateData, projectsResponseData, projectsRowData } from '@/entities/project/types/project.types';
import { filterTreeRowsBySearch } from '@/shared/lib/search';
import { useHeaderSearchStore } from '@/shared/store/header-search.store';
import EditProject from '@/shared/ui/edit/EditProject.vue';
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElButton, ElPopconfirm, ElText } from 'element-plus';
import { computed, ref } from 'vue';

const props = defineProps<{
    data: projectsResponseData
}>()

const headerSearchStore = useHeaderSearchStore()
const selectedRow = ref<projectCreateData>()
const selectedId = ref<number>()
const isOpenEdit = ref(false)
const { mutate } = useDeleteProject()
const tableRows = computed(() => filterTreeRowsBySearch(
    props.data.rows,
    headerSearchStore.debouncedQuery,
    (row: projectsRowData) => [
        row.title,
        row.note,
        row.status,
        row.money_limit,
        row.total,
        row.total_formatted,
    ],
))

function getPercentage(total: string | number, limit: string | number) {
    const spent = Number(total)
    const max = Number(limit)

    if (!max) return 0

    return Math.min(Math.round((spent / max) * 100), 100)
}

function handleConfirm(id: number) {
  mutate({
    project_id: id,
  })
}

function handleUpdate(row: any) {
    selectedRow.value = { ...row }
    selectedId.value = row.id
    isOpenEdit.value = true
}
</script>

<template>
    <EditProject 
        v-model="isOpenEdit"
        title="Редактирование проекта"
        :id="selectedId || null"
        :projects="data.rows"
        v-if="selectedRow"
        :update-data="selectedRow"
    />
    <div class="h-full w-full">
        <ElTable 
            height="100%"
            border 
            :data="tableRows"
            row-key="id"
            :tree-props="{ children: 'children' }"
        >
            <ElTableColumn prop="title" label="Название проекта">
                <template #default="{ row }">
                    <span>{{ row.title }}</span>
                    <span class="text-[red] ml-1" v-if="row.status === 'closed'">(Закрыт)</span>
                </template>
            </ElTableColumn>
            <ElTableColumn width="300" label="Текущий" align="center">
                <template #default="{ row }">
                    <ElProgress
                        :text-inside="true"
                        :stroke-width="20"
                        :percentage="getPercentage(row.total, row.money_limit)"
                        :status="getPercentage(row.total, row.money_limit) > 90
                            ? 'exception'
                            : 'success'"
                    >
                        <span>{{ row.total_formatted }}</span>
                    </ElProgress>
                    <p>
                        Лимит {{ row.money_limit }} р
                    </p>
                </template>
            </ElTableColumn>
            <ElTableColumn width="300" prop="current" label="Период"> 
                <template #default="{ row }">
                    <ElText type="danger">
                        {{ row.total_formatted }}
                    </ElText>
                </template>
            </ElTableColumn>

            <ElTableColumn
                width="140px"
                align="center"
            >
                <template #default="{ row }">
                    <ElButton type="primary" @click="handleUpdate(row)" :icon="EditPen" />
                    <ElPopconfirm
                        width="220"
                        :icon="undefined"
                        title="Вы хотите удалить проект?"
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

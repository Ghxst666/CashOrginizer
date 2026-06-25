<script setup lang="ts">
import { projectCreateData, projectsResponseData, projectsRowData } from '@/entities/project/types/project.types';
import { filterTreeRowsBySearch } from '@/shared/lib/search';
import { useHeaderSearchStore } from '@/shared/store/header-search.store';
import EditProject from '@/shared/ui/edit/EditProject.vue';
import { ElText } from 'element-plus';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
    data: projectsResponseData
}>()

const emit = defineEmits<{
    select: [row: projectsRowData]
}>()

const headerSearchStore = useHeaderSearchStore()
const selectedRow = ref<projectCreateData>()
const selectedId = ref<number>()
const isOpenEdit = ref(false)
const contextMenu = ref({
    visible: false,
    x: 0,
    y: 0,
    row: null as projectsRowData | null,
})
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

function handleUpdate(row: any) {
    selectedRow.value = { ...row }
    selectedId.value = row.id
    isOpenEdit.value = true
}

function handleRowClick(row: projectsRowData) {
    emit('select', row)
}

function handleRowContextMenu(row: projectsRowData, _column: unknown, event: MouseEvent) {
  event.preventDefault()
  contextMenu.value = {
    visible: true,
    x: Math.min(event.clientX, window.innerWidth - 180),
    y: Math.min(event.clientY, window.innerHeight - 48),
    row,
  }
}

function closeContextMenu() {
  contextMenu.value.visible = false
}

function handleEditFromContextMenu() {
  if (contextMenu.value.row) handleUpdate(contextMenu.value.row)
  closeContextMenu()
}

onMounted(() => window.addEventListener('click', closeContextMenu))
onBeforeUnmount(() => window.removeEventListener('click', closeContextMenu))
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
            @row-click="handleRowClick"
            @row-contextmenu="handleRowContextMenu"
        >
            <ElTableColumn prop="title" label="Название проекта">
                <template #default="{ row }">
                    <span>{{ row.title }}</span>
                    <span class="text-[red] ml-1" v-if="row.status === 'closed'">(Закрыт)</span>
                </template>
            </ElTableColumn>
            <ElTableColumn width="300" prop="current" label="Период"> 
                <template #default="{ row }">
                    <ElText type="danger">
                        {{ row.total_formatted }}
                    </ElText>
                </template>
            </ElTableColumn>
        </ElTable>
        <div
          v-if="contextMenu.visible"
          class="context-menu"
          :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
          role="menu"
          @click.stop
        >
          <button type="button" role="menuitem" @click="handleEditFromContextMenu">
            Редактировать
          </button>
        </div>
    </div>
</template>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 3000;
  min-width: 160px;
  padding: 4px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
}

.context-menu button {
  width: 100%;
  padding: 8px 12px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #303133;
  cursor: pointer;
  text-align: left;
}

.context-menu button:hover {
  background: #ecf5ff;
  color: #409eff;
}
</style>

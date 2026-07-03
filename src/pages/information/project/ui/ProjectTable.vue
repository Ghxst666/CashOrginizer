<script setup lang="ts">
import { projectCreateData, projectsResponseData, projectsRowData } from '@/entities/project/types/project.types';
import { filterTreeRowsBySearch } from '@/shared/lib/search';
import { useHeaderSearchStore } from '@/shared/store/header-search.store';
import EditProject from '@/shared/ui/edit/EditProject.vue';
import { useMediaQuery } from '@vueuse/core';
import { ElText } from 'element-plus';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
    data: projectsResponseData
}>()

const emit = defineEmits<{
    select: [row: projectsRowData]
    openPayments: [row: projectsRowData]
}>()

const headerSearchStore = useHeaderSearchStore()
const isMobile = useMediaQuery('(max-width: 768px)')
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

function handleRowDblClick(row: projectsRowData) {
    emit('openPayments', row)
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
        <div
            v-if="isMobile"
            class="project-mobile-list"
        >
            <button
                v-for="row in tableRows"
                :key="row.id"
                type="button"
                class="project-mobile-card"
                @click="handleRowClick(row)"
                @dblclick="handleRowDblClick(row)"
            >
                <span class="project-mobile-card__top">
                    <strong>{{ row.title }}</strong>
                    <span
                        v-if="row.status === 'closed'"
                        class="project-mobile-card__closed"
                    >
                        Закрыт
                    </span>
                </span>
                <span class="project-mobile-card__amount">{{ row.total_formatted }}</span>
                <ElButton
                    size="small"
                    @click.stop="handleUpdate(row)"
                >
                    Редактировать
                </ElButton>
            </button>
        </div>

        <ElTable 
            v-else
            height="100%"
            border 
            :data="tableRows"
            row-key="id"
            :tree-props="{ children: 'children' }"
            @row-click="handleRowClick"
            @row-dblclick="handleRowDblClick"
            @row-contextmenu="handleRowContextMenu"
        >
            <ElTableColumn show-overflow-tooltip prop="title" label="Название проекта">
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
.project-mobile-list {
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding: 10px;
  background: #f4f7f9;
}

.project-mobile-card {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  border: 1px solid #dfe6ee;
  border-radius: 8px;
  background: #fff;
  padding: 12px;
  color: #1f2937;
  text-align: left;
  gap: 8px 12px;
  box-shadow: 0 6px 18px rgb(15 23 42 / 6%);
}

.project-mobile-card__top {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
}

.project-mobile-card strong {
  min-width: 0;
  overflow: hidden;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-mobile-card__closed {
  flex: 0 0 auto;
  color: #dc2626;
  font-size: 12px;
}

.project-mobile-card__amount {
  color: #0f766e;
  font-weight: 700;
}

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

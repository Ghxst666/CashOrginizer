<script setup lang="ts">
import { purposesResponseData, purposesRowData } from '@/entities/purposes/types/purposes.types';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
    data: purposesResponseData
}>()

const emit = defineEmits<{
    edit: [purpose: purposesRowData]
    select: [purpose: purposesRowData]
}>()

const contextMenu = ref({
    visible: false,
    x: 0,
    y: 0,
    row: null as purposesRowData | null,
})

function handleUpdate(row: purposesRowData) {
    emit('edit', { ...row })
}

function handleRowClick(row: purposesRowData) {
    emit('select', row)
}

function handleRowContextMenu(row: purposesRowData, _column: unknown, event: MouseEvent) {
    event.preventDefault()

    if (row.title === 'Без названия') {
        closeContextMenu()
        return
    }

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
    <div class="h-full w-full">
        <ElTable 
            height="100%"
            border 
            :data="props.data.rows"
            @row-click="handleRowClick"
            @row-contextmenu="handleRowContextMenu"
        >
            <ElTableColumn show-overflow-tooltip width="400" prop="title" label="Название" />
            <ElTableColumn show-overflow-tooltip prop="note" label="Примечание" />
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

<script setup lang="ts">
import Sortable, { type SortableEvent } from 'sortablejs'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { accountsResponse } from '../transaction/invoices/types/invoices.types'

const props = withDefaults(defineProps<{
  data: accountsResponse[]
  reorderable?: boolean
}>(), {
  reorderable: false,
})

const emit = defineEmits<{
  edit: [row: accountsResponse]
  select: [row: accountsResponse]
  openPayments: [row: accountsResponse]
  reorder: [accountIds: number[]]
}>()

const tableRef = ref<{ $el: HTMLElement } | null>(null)
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  row: null as accountsResponse | null,
})

function handleRowClick(row: accountsResponse) {
  emit('select', row)
}

function handleRowDblClick(row: accountsResponse) {
  emit('openPayments', row)
}

let sortable: Sortable | null = null

async function initializeSortable() {
  await nextTick()

  const tableBody = tableRef.value?.$el.querySelector<HTMLElement>('.el-table__body-wrapper tbody')
  if (!tableBody) return

  sortable = Sortable.create(tableBody, {
    animation: 150,
    disabled: !props.reorderable,
    draggable: 'tr.el-table__row',
    handle: '.drag-handle',
    forceFallback: true,
    fallbackOnBody: true,
    fallbackTolerance: 2,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    onEnd: (event: SortableEvent) => {
      if (event.oldIndex === undefined || event.newIndex === undefined || event.oldIndex === event.newIndex) return

      const accountIds = props.data.map(account => account.id)
      const [movedAccountId] = accountIds.splice(event.oldIndex, 1)
      if (movedAccountId === undefined) return

      accountIds.splice(event.newIndex, 0, movedAccountId)
      emit('reorder', accountIds)
    },
  })
}

function handleRowContextMenu(row: accountsResponse, _column: unknown, event: MouseEvent) {
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
  if (contextMenu.value.row) emit('edit', contextMenu.value.row)
  closeContextMenu()
}

onMounted(() => {
  window.addEventListener('click', closeContextMenu)
  initializeSortable()
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeContextMenu)
  sortable?.destroy()
})

watch(
  () => props.reorderable,
  reorderable => sortable?.option('disabled', !reorderable),
)
</script>

<template>
  <div class="h-full min-h-0 min-w-0 flex overflow-hidden">
    <ElTable
      ref="tableRef"
      height="100%"
      border
      :data="data"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblClick"
      @row-contextmenu="handleRowContextMenu"
    >
      <ElTableColumn width="50" type="index" label="№" />
      <ElTableColumn prop="title" label="Название счёта" />
      <ElTableColumn width="100" prop="currency" label="Валюта" />
      <ElTableColumn width="500" prop="amount" label="Общий баланс">
        <template #default="{ row }">
          <span>{{ row.amount }} {{ row.currency }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn width="56" align="center">
        <template #default>
          <span
            class="drag-handle"
            :class="{ 'drag-handle--disabled': !reorderable }"
            :title="reorderable ? 'Перетащите, чтобы изменить порядок' : undefined"
            @click.stop
          >
            ⠿
          </span>
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
.drag-handle {
  display: inline-flex;
  cursor: grab;
  color: #6b7280;
  font-size: 24px;
  line-height: 1;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle--disabled {
  cursor: default;
  opacity: 0.35;
}

:deep(.sortable-ghost td) {
  background: #ecf5ff !important;
  opacity: 0.65;
}

:deep(.sortable-chosen) {
  cursor: grabbing;
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

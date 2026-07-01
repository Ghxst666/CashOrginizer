<script setup lang="ts">
import Sortable from 'sortablejs'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { accountsResponse } from '../transaction/invoices/types/invoices.types'

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
const tableData = ref<accountsResponse[]>([])
const tableBody = ref<HTMLElement | null>(null)
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

function getTableRows() {
  return Array.from(tableBody.value?.querySelectorAll<HTMLTableRowElement>('tr.el-table__row') ?? [])
}

function syncSortableRowIds() {
  getTableRows().forEach((row, index) => {
    const account = tableData.value[index]

    if (account) {
      row.dataset.accountId = String(account.id)
    } else {
      delete row.dataset.accountId
    }
  })
}

function readSortedAccountIds() {
  const accountIds = getTableRows().map(row => Number(row.dataset.accountId))

  if (
    accountIds.length !== tableData.value.length
    || accountIds.some(accountId => !Number.isFinite(accountId))
    || new Set(accountIds).size !== accountIds.length
  ) {
    return null
  }

  return accountIds
}

function applyAccountOrder(accountIds: number[]) {
  const accountsById = new Map(tableData.value.map(account => [account.id, account]))
  const nextData = accountIds.map(accountId => accountsById.get(accountId))

  if (nextData.some(account => !account)) return null

  tableData.value = nextData as accountsResponse[]

  return accountIds
}

async function initializeSortable() {
  await nextTick()

  tableBody.value = tableRef.value?.$el.querySelector<HTMLElement>('.el-table__body-wrapper tbody') ?? null
  if (!tableBody.value) return

  syncSortableRowIds()

  sortable = Sortable.create(tableBody.value, {
    animation: 150,
    disabled: !props.reorderable,
    draggable: 'tr.el-table__row',
    handle: '.drag-handle',
    forceFallback: true,
    fallbackOnBody: true,
    fallbackTolerance: 2,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    onStart: syncSortableRowIds,
    onEnd: () => {
      const accountIds = readSortedAccountIds()
      if (!accountIds) {
        void nextTick(syncSortableRowIds)
        return
      }

      const currentOrder = tableData.value.map(account => account.id)
      if (accountIds.every((accountId, index) => accountId === currentOrder[index])) return

      const nextOrder = applyAccountOrder(accountIds)
      if (!nextOrder) {
        void nextTick(syncSortableRowIds)
        return
      }

      void nextTick(syncSortableRowIds)

      emit('reorder', nextOrder)
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

watch(
  () => props.data,
  data => {
    tableData.value = [...data]
    void nextTick(syncSortableRowIds)
  },
  { immediate: true },
)
</script>

<template>
  <div class="h-full min-h-0 min-w-0 flex overflow-hidden">
    <ElTable
      ref="tableRef"
      height="100%"
      border
      row-key="id"
      :data="tableData"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblClick"
      @row-contextmenu="handleRowContextMenu"
    >
      <ElTableColumn width="50" type="index" label="№" />
      <ElTableColumn show-overflow-tooltip prop="title" label="Название счёта" />
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

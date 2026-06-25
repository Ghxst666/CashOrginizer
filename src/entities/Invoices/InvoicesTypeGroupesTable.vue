<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  accountsResponse,
  accountsSortedByGroupsResponse,
  accountsSortedByTypeResponse,
} from '../transaction/invoices/types/invoices.types'

type AccountsGroup = accountsSortedByTypeResponse | accountsSortedByGroupsResponse

const props = defineProps<{
  data: AccountsGroup[]
}>()

const groups = computed(() => props.data)

const emit = defineEmits<{
  edit: [row: accountsResponse]
  select: [row: accountsResponse]
}>()

const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  row: null as accountsResponse | null,
})

function getGroupKey(group: AccountsGroup) {
  return 'group_id' in group ? group.group_id : group.type
}

function handleRowClick(row: accountsResponse) {
  emit('select', row)
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

onMounted(() => window.addEventListener('click', closeContextMenu))
onBeforeUnmount(() => window.removeEventListener('click', closeContextMenu))
</script>

<template>
  <div class="h-full min-h-0 overflow-y-auto bg-white p-4">
    <div
      v-for="group in groups"
      :key="getGroupKey(group)"
      class="mb-6"
    >
      <h3 class="mb-2 text-lg font-semibold">{{ group.title }}</h3>

      <ElTable
        :data="group.accounts"
        border
        @row-click="handleRowClick"
        @row-contextmenu="handleRowContextMenu"
      >
        <ElTableColumn width="50" type="index" label="№" />
        <ElTableColumn show-overflow-tooltip prop="title" label="Название счёта" />
        <ElTableColumn width="100" prop="currency" label="Валюта" />
        <ElTableColumn width="500" prop="amount" label="Общий баланс">
          <template #default="{ row }">
            {{ Number(row.amount).toLocaleString('ru-RU') }} {{ row.currency }}
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

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

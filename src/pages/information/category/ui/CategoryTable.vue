<script setup lang="ts">
import { CategoryResponseData, CategoryRowData, CreateCategoryData } from '@/entities/category/types/category.types';
import type { PaymentType } from '@/entities/transaction/payments/types/payments.types';
import { filterTreeRowsBySearch } from '@/shared/lib/search';
import { useHeaderSearchStore } from '@/shared/store/header-search.store';
import EditCategory from '@/shared/ui/edit/EditCategory.vue';
import { ElText } from 'element-plus';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
    data: CategoryResponseData
}>()

const emit = defineEmits<{
    select: [row: CategoryRowData]
}>()

const headerSearchStore = useHeaderSearchStore()
const selectedRow = ref<CreateCategoryData>()
const selectedId = ref<number>()
const isOpenEdit = ref(false)
const contextMenu = ref({
    visible: false,
    x: 0,
    y: 0,
    row: null as CategoryRowData | null,
})
const tableRows = computed(() => filterTreeRowsBySearch(
    props.data.rows,
    headerSearchStore.debouncedQuery,
    (row: CategoryRowData) => [
        row.title,
        row.type,
        paymentTypeTitle(row.type as PaymentType),
        row.total,
        row.total_formatted,
    ],
))

function paymentTypeTitle(type?: PaymentType | null) {
    if (type === 'expenses') return 'Расход'
    if (type === 'profits') return 'Доход'
    if (type === 'transfers') return 'Перевод'

    return 'Не указан'
}

function paymentTypeTextType(type?: PaymentType | null) {
    if (type === 'expenses') return 'danger'
    if (type === 'transfers') return 'info'

    return 'success'
}

function handleUpdate(row: any) {
    selectedRow.value = { ...row }
    selectedId.value = row.id
    isOpenEdit.value = true
}

function handleRowClick(row: CategoryRowData) {
    emit('select', row)
}

function handleRowContextMenu(row: CategoryRowData, _column: unknown, event: MouseEvent) {
  event.preventDefault()

  if (row.type === 'transfers' || row.title === 'Без категории') {
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
            :data="tableRows"
            row-key="id"
            :tree-props="{ children: 'children' }"
            @row-click="handleRowClick"
            @row-contextmenu="handleRowContextMenu"
        >
            <ElTableColumn prop="title" label="Название категории" />
            <ElTableColumn width="300" prop="type" label="Тип">
                <template #default="{ row }">
                    <ElText :type="paymentTypeTextType(row.type as PaymentType)">
                        {{ paymentTypeTitle(row.type as PaymentType) }}
                    </ElText>
                </template>
            </ElTableColumn>
            <ElTableColumn width="300" prop="total_formatted" label="Операция" />
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

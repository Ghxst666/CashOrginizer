<script setup lang="ts">
import { useDeleteCategory } from '@/entities/category';
import { CategoryResponseData, CategoryRowData, CreateCategoryData } from '@/entities/category/types/category.types';
import type { PaymentType } from '@/entities/transaction/payments/types/payments.types';
import { filterTreeRowsBySearch } from '@/shared/lib/search';
import { useHeaderSearchStore } from '@/shared/store/header-search.store';
import EditCategory from '@/shared/ui/edit/EditCategory.vue';
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElButton, ElPopconfirm, ElText } from 'element-plus';
import { computed, ref } from 'vue';

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

const { mutate } = useDeleteCategory()
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

function handleConfirm(id: number) {
  mutate({
    category_id: id,
  })
}


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

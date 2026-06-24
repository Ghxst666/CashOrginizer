<script setup lang="ts">
import { useDeleteCategory, useUpdateCategory } from '@/entities/category';
import { CategoryResponseData, CreateCategoryData } from '@/entities/category/types/category.types';
import { ElDialog, ElForm, ElFormItem, ElInput, ElOption, ElSelect } from 'element-plus';
import { computed, ref, watch } from 'vue';
const props = defineProps<{
    title: string
    updateData: CreateCategoryData
    categories: CategoryResponseData['rows']
    id: number | null
}>()

const { mutate, isPending } = useUpdateCategory()
const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory()

const newCategoryData = ref<CreateCategoryData>({
    title: '',
    type: '',
    parent_id: null,
})

const isOpen = defineModel<boolean>({ default: false })

const disabled = computed(() => isPending.value)

function handleUpdate() {
    if (!props.id) return

    mutate({
        category_id: props.id,
        data: newCategoryData.value
    }, {
        onSuccess: () => {
            isOpen.value = false
        }
    })
}

function handleClose() {
    isOpen.value = false
}

function handleDelete() {
    if (!props.id) return

    deleteCategory(
        { category_id: props.id },
        { onSuccess: () => { isOpen.value = false } },
    )
}

function flattenCategories(categories: any[]): any {
    return categories.flatMap(category => [
        category,
        ...flattenCategories(category.children || [])
    ])
}

const flatCategories = computed(() =>
    flattenCategories(props.categories).filter((category: { type: string, id: number, title: string }) => (
      category.type !== 'transfers' && category.id !== props.id && category.title !== 'Без категории'
    ))
)

watch(
  () => props.updateData,
  (val) => {
    if (val) {
      newCategoryData.value = { ...val }
    }
  },
  { immediate: true }
)
</script>

<template>
    <ElDialog :title="props.title" v-model="isOpen" width="800">
        <ElForm 
            :model="newCategoryData" 
            label-position="top"
            class="payment-form"
        >
            <ElFormItem label="Название">
                <ElInput v-model="newCategoryData.title" />
            </ElFormItem>
            <ElFormItem label="Тип">
                <ElSelect v-model="newCategoryData.type">
                    <ElOption label="Расходные" value="expenses" />
                    <ElOption label="Приходные" value="profits" />
                    <ElOption label="Перевод" value="transfers" />
                </ElSelect>
            </ElFormItem> 
            <ElFormItem v-if="newCategoryData.type === 'transfers'" label="В*">
                <ElSelect v-model="newCategoryData.parent_id">
                    <ElOption
                        v-for="category in flatCategories"
                        :key="category.id"
                        :label="category.title"
                        :value="category.id"
                    />
                </ElSelect>
            </ElFormItem>           
        </ElForm>

        <template #footer>
            <div class="flex justify-between">
              <ElPopconfirm
                width="220"
                :icon="undefined"
                title="Вы хотите удалить категорию?"
                @confirm="handleDelete"
              >
                <template #reference>
                  <ElButton type="danger" :loading="isDeleting" :disabled="disabled">
                    Удалить
                  </ElButton>
                </template>
              </ElPopconfirm>
              <div class="flex gap-2">
                <ElButton @click="handleClose">
                  Отмена
                </ElButton>
                <ElButton @click="handleUpdate" type="primary" :disabled="disabled">
                  Сохранить
                </ElButton>
              </div>
            </div>
        </template>
    </ElDialog>
</template>

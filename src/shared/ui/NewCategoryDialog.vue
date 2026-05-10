<script setup lang="ts">
import { useCreateCategory } from '@/entities/category';
import { CategoryResponseData, CreateCategoryData } from '@/entities/category/types/category.types';
import { ElDialog, ElForm, ElFormItem, ElInput, ElOption, ElSelect } from 'element-plus';
import { computed, ref, watch } from 'vue';
const props = defineProps<{
    title: string
    categories: CategoryResponseData['rows']
}>()

const { mutate, isPending, isSuccess } = useCreateCategory()

const newCategoryData = ref<CreateCategoryData>({
    title: '',
    type: '',
    parent_id: null,
})

const isOpen = defineModel<boolean>({ default: false })

const disabled = computed(() => isPending.value)

function handleCreate() {
    mutate(newCategoryData.value)
}

function handleClose() {
    isOpen.value = false
    newCategoryData.value = {
        title: '',
        type: '',
        parent_id: null,
    }
}

function flattenCategories(categories: any[]): any {
    return categories.flatMap(category => [
        category,
        ...flattenCategories(category.children || [])
    ])
}

const flatCategories = computed(() =>
    flattenCategories(props.categories)
)

watch(isSuccess, () => {
  isOpen.value = false
  newCategoryData.value = {
    title: '',
    type: '',
    parent_id: null,
  }
})
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
                    <ElOption label="Подкатегория" value="transfers" />
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
                <ElButton @click="handleCreate" :disabled="disabled">
                    OK
                </ElButton>

                <ElButton @click="handleClose">
                    Отмена
                </ElButton>
            </div>
        </template>
    </ElDialog>
</template>
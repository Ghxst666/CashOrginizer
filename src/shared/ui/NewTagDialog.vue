<script setup lang="ts">
import { useCreateTag } from '@/entities/tags';
import { CreateTagRequestData } from '@/entities/tags/types/tags.types';
import { ElDialog, ElForm, ElFormItem, ElInput, ElSelect } from 'element-plus';
import { computed, ref, watch } from 'vue';
const props = defineProps<{
    title: string
}>()

const { mutate, isPending, isSuccess } = useCreateTag()

const newTagData = ref<CreateTagRequestData>({
    title: '',
    color: '',
    sorting: 1
})

const isOpen = defineModel<boolean>({ default: false })

const disabled = computed(() => isPending.value)

function handleCreate() {
    mutate(newTagData.value)
}

function handleClose() {
    isOpen.value = false
    newTagData.value = {
        title: '',
        color: '',
        sorting: 1
    }
}

watch(isSuccess, () => {
  isOpen.value = false
  newTagData.value = {
    title: '',
    color: '',
    sorting: 1
  }
})
</script>

<template>
    <ElDialog :title="props.title" v-model="isOpen" width="800">

        <ElForm 
            :model="newTagData" 
            label-position="top"
            class="payment-form"
        >
            <ElFormItem label="Название">
                <ElInput v-model="newTagData.title" />
            </ElFormItem>
            <ElFormItem label="Цвет">
                <ElSelect v-model="newTagData.color">
                    <ElOption label="красный" value="red" />
                    <ElOption label="синий" value="blue" />
                    <ElOption label="зеленый" value="green" />
                </ElSelect>
            </ElFormItem> 
            <ElFormItem label="Сортировка">
                <ElSelect v-model="newTagData.sorting">
                    <ElOption label="1" value="1" />
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
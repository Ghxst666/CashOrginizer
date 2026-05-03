<script setup lang="ts">
import { useUpdateTag } from '@/entities/tags/composables/tags.queries';
import { CreateTagRequestData } from '@/entities/tags/types/tags.types';
import { ElDialog, ElForm, ElFormItem, ElInput, ElSelect } from 'element-plus';
import { computed, ref, watch } from 'vue';
const props = defineProps<{
    title: string
    updateData: CreateTagRequestData
    id: string
}>()

const { mutate, isPending } = useUpdateTag()

const isOpen = defineModel<boolean>({ default: false })

const disabled = computed(() => isPending.value)

const form = ref<CreateTagRequestData>({
  title: '',
  color: '',
  sorting: 1
})

function handleUpdate() {
    if (!props.id) return

    mutate({
        tag_id: props.id,
        data: form.value
    }, {
        onSuccess: () => {
        isOpen.value = false
        }
    })
}

function handleClose() {
    isOpen.value = false
}

watch(
  () => props.updateData,
  (val) => {
    if (val) {
      form.value = { ...val }
    }
  },
  { immediate: true }
)
</script>

<template>
    <ElDialog :title="props.title" v-model="isOpen" width="800">

        <ElForm 
            :model="form" 
            label-position="top"
            class="payment-form"
        >
            <ElFormItem label="Название">
                <ElInput v-model="form.title" />
            </ElFormItem>
            <ElFormItem label="Цвет">
                <ElSelect v-model="form.color">
                    <ElOption label="красный" value="red" />
                    <ElOption label="синий" value="blue" />
                    <ElOption label="зеленый" value="green" />
                </ElSelect>
            </ElFormItem> 
            <ElFormItem label="Сортировка">
                <ElSelect v-model="form.sorting">
                    <ElOption label="1" value="1" />
                </ElSelect>
            </ElFormItem>           
        </ElForm>

        <template #footer>
            <div class="flex justify-between">
                <ElButton @click="handleUpdate" type="primary" :disabled="disabled">
                    Сохранить
                </ElButton>

                <ElButton @click="handleClose">
                    Отмена
                </ElButton>
            </div>
        </template>
    </ElDialog>
</template>
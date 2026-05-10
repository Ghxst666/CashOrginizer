<script setup lang="ts">
import { useCreateProject } from '@/entities/project';
import { projectCreateData, projectsResponseData } from '@/entities/project/types/project.types';
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElOption, ElSelect } from 'element-plus';
import { computed, ref, watch } from 'vue';
const props = defineProps<{
    title: string
    projects: projectsResponseData['rows']
}>()

const { mutate, isPending, isSuccess } = useCreateProject()

const FormData = ref<projectCreateData>({
    title: '',
    parent_id: null,
    money_limit: 0,
    note: '',
    status: '',
})

const isOpen = defineModel<boolean>({ default: false })
const disabled = computed(() => isPending.value)

function handleCreate() {
    mutate(FormData.value)
}

function handleClose() {
    isOpen.value = false
    FormData.value = {
        title: '',
        parent_id: null,
        money_limit: 0,
        note: '',
        status: '',
    }
}

function flattenProjects(projects: any[]): any {
    return projects.flatMap(project => [
        project,
        ...flattenProjects(project.children || [])
    ])
}

const flatProjects = computed(() =>
    flattenProjects(props.projects)
)

watch(isSuccess, () => {
    isOpen.value = false
    FormData.value = {
        title: '',
        parent_id: null,
        money_limit: 0,
        note: '',
        status: '',
    }
})
</script>

<template>
    <ElDialog :title="props.title" v-model="isOpen" width="800">

        <ElForm 
            :model="FormData" 
            label-position="top"
            class="payment-form"
        >
            <ElFormItem label="Название">
                <ElInput v-model="FormData.title" />
            </ElFormItem>
            <ElFormItem label="Подпроект в">
                <ElSelect v-model="FormData.parent_id">
                    <ElOption
                        v-for="category in flatProjects"
                        :key="category.id"
                        :label="category.title"
                        :value="category.id"
                    />
                </ElSelect>
            </ElFormItem> 
            <ElFormItem label="Лимит">
                <ElInput v-model="FormData.money_limit" />
            </ElFormItem>
            <ElFormItem label="Примечание">
                <ElInput v-model="FormData.note" />
            </ElFormItem>
            <ElFormItem label="Состояние">
                <ElSelect v-model="FormData.status">
                    <ElOption label="Открыт" value="open" />
                    <ElOption label="Закрыт" value="closed" />
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
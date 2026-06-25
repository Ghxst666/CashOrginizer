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

type ProjectFormData = Omit<projectCreateData, 'parent_id'> & {
    parent_id: number | '' | null
}

const FormData = ref<ProjectFormData>({
    title: '',
    parent_id: null,
    money_limit: 0,
    note: '',
    status: '',
})

const isOpen = defineModel<boolean>({ default: false })
const disabled = computed(() => isPending.value)

function handleCreate() {
    mutate({
        ...FormData.value,
        parent_id: FormData.value.parent_id || null,
    })
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
        <ElScrollbar>
            <ElForm 
                :model="FormData" 
                label-position="top"
                class="purpose-form"
            >
                <ElFormItem label="Название">
                    <ElInput v-model="FormData.title" />
                </ElFormItem>
                <ElFormItem label="Подпроект в">
                    <ElSelect v-model="FormData.parent_id">
                        <ElOption label="Без проекта" value="" />
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
        </ElScrollbar>

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

<style scoped>
.purpose-form {
  padding: 16px;
  border-radius: 12px;
  background: #eef3f4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04);
}

.purpose-form :deep(.el-form-item__label) {
  font-weight: 700;
  color: #2f3a3d;
  margin-bottom: 6px;
}

.purpose-form :deep(.el-input__wrapper),
.purpose-form :deep(.el-select__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(120, 140, 145, 0.18) inset;
}
</style>
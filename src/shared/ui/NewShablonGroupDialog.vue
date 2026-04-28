<script setup lang="ts">
import { ElDialog } from 'element-plus';
const props = defineProps<{
    title: string
}>()

const emits = defineEmits<{
    close: []
}>()


const newPayDialogVisible = defineModel<boolean>('newPay', { required: true })
</script>

<template>
    <ElDialog :title="props.title" v-model="newPayDialogVisible" width="800">

        <slot />

        <template #footer>
            <div class="flex justify-between">
                <ElButton>
                    OK
                </ElButton>

                <ElButton @click="emits('close')">
                    Отмена
                </ElButton>
            </div>
        </template>
    </ElDialog>
</template>
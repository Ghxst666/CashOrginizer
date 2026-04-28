<script setup lang="ts">
import { ElDialog } from 'element-plus';
import { ref } from 'vue';
const props = defineProps<{
    title: string
    firstStepTitle?: string
    secondStepTitle?: string
    threeStepTitle?: string
}>()

const emits = defineEmits<{
    close: []
}>()

const activeStep = ref(0)

const nextStep = () => {
  if (activeStep.value < 2) {
    activeStep.value++
  }
}

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

const newPayDialogVisible = defineModel<boolean>('newPay', { required: true })
</script>

<template>
    <ElDialog :title="props.title" v-model="newPayDialogVisible" width="800">
        <ElSteps
            :active="activeStep"
            finish-status="success"
            align-center
            class="mb-6"
        >
            <ElStep :title="props.firstStepTitle || 'Шаг 1'" />
            <ElStep :title="props.secondStepTitle || 'Шаг 2'" />
            <ElStep :title="props.threeStepTitle || 'Шаг 3'" />
        </ElSteps>

        <div class="step-content">
            <slot
                v-if="activeStep === 0"
                name="step-1"
            />

            <slot
                v-if="activeStep === 1"
                name="step-2"
            />

            <slot
                v-if="activeStep === 2"
                name="step-3"
            />
        </div>

        <template #footer>
            <div class="flex justify-between">
                <ElButton
                    v-if="activeStep > 0"
                    @click="prevStep"
                    >
                    Назад
                </ElButton>

                <div>
                    <ElButton @click="emits('close')">
                        Отмена
                    </ElButton>

                    <ElButton
                        v-if="activeStep < 2"
                        type="primary"
                        @click="nextStep"
                    >
                        Далее
                    </ElButton>

                    <slot
                        v-else
                        name="actions"
                    >
                        <ElButton
                            type="primary"
                            @click="emits('close')"
                        >
                            Готово
                        </ElButton>
                    </slot>
                </div>
            </div>
        </template>
    </ElDialog>
</template>
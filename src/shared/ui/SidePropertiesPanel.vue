<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    title?: string
    width?: string
  }>(),
  {
    title: 'Свойства',
    width: '500px',
  }
)

const isOpen = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  close: []
}>()

function handleClose() {
  isOpen.value = false
  emit('close')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="shrink-0 h-full border-l border-[#e2e3e6] bg-white flex flex-col"
    :style="{ width: props.width, minWidth: props.width }"
  >
    <div class="h-[65px] px-4 border-b border-[#e2e3e6] flex items-center justify-between">
      <h3 class="font-semibold">{{ props.title }}</h3>
      <ElButton text circle :icon="Close" @click="handleClose" />
    </div>

    <div class="flex-1 min-h-0 overflow-auto p-4">
      <slot :close="handleClose" />
    </div>
  </div>
</template>

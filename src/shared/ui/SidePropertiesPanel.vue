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
    class="side-properties-panel shrink-0 h-full border-l border-[#e2e3e6] bg-white flex flex-col"
    :style="{ width: props.width, minWidth: props.width }"
  >
    <div class="side-properties-panel__header h-[65px] px-4 border-b border-[#e2e3e6] flex items-center justify-between">
      <h3 class="font-semibold">{{ props.title }}</h3>
      <ElButton text circle :icon="Close" @click="handleClose" />
    </div>

    <div class="side-properties-panel__body flex-1 min-h-0 overflow-auto p-4">
      <slot :close="handleClose" />
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .side-properties-panel {
    position: fixed;
    right: 0;
    bottom: calc(68px + env(safe-area-inset-bottom));
    left: 0;
    z-index: 900;
    width: 100% !important;
    min-width: 0 !important;
    height: min(72dvh, 560px);
    border-top: 1px solid #d7dde5;
    border-left: 0;
    border-radius: 14px 14px 0 0;
    box-shadow: 0 -16px 36px rgb(15 23 42 / 20%);
  }

  .side-properties-panel__header {
    height: 54px;
    padding-inline: 14px;
  }

  .side-properties-panel__body {
    padding: 14px;
  }
}
</style>

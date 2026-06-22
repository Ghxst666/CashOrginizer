<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  content: string
}>()

const textElement = ref<HTMLElement | null>(null)
const isOverflowing = ref(false)
let resizeObserver: ResizeObserver | null = null

function updateOverflowState() {
  const element = textElement.value
  isOverflowing.value = Boolean(element && element.scrollWidth > element.clientWidth)
}

watch(
  () => props.content,
  () => nextTick(updateOverflowState),
)

onMounted(() => {
  if (!textElement.value) return

  resizeObserver = new ResizeObserver(updateOverflowState)
  resizeObserver.observe(textElement.value)
  nextTick(updateOverflowState)
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <ElTooltip :content="content" :disabled="!isOverflowing" placement="left">
    <span ref="textElement" class="overflow-tooltip">
      <slot>{{ content }}</slot>
    </span>
  </ElTooltip>
</template>

<style scoped>
.overflow-tooltip {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

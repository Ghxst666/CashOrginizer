<script setup lang="ts">
import { BaseTransitionProps, ref, TransitionProps } from 'vue';
import { useEventListener } from '@vueuse/core'
import { DArrowLeft } from '@element-plus/icons-vue';
import { menuItems } from '../const/menu.const';
import { useRouter } from 'vue-router';

const BREAKPOINT_COLLAPSE = 1327

const router = useRouter()

const isCollapsed = ref<boolean>(window.innerWidth <= BREAKPOINT_COLLAPSE)

function toggleMenu() {
  isCollapsed.value = !isCollapsed.value
}

function handleGoTo(pageName: string | undefined) {
  if (pageName) {
    router.push({ name: pageName })
  }
}

function updateWidth() {
  isCollapsed.value = window.innerWidth <= BREAKPOINT_COLLAPSE
}


useEventListener(window, 'resize', updateWidth)

const logoListeners = {
  onBeforeEnter(el: HTMLElement) {
    el.style.opacity = '0.2'
  },
  onEnter(el: HTMLElement, done) {
    el.classList.add('el-opacity-transition')
    el.style.opacity = '1'
    done()
  },
  onAfterEnter(el: HTMLElement) {
    el.classList.remove('el-opacity-transition')
    el.style.opacity = ''
  },
  onBeforeLeave(el: HTMLElement) {
    if (!el.dataset)
      (el as any).dataset = {}

    if (el.classList.contains('is-collapsed')) {
      el.classList.remove('is-collapsed')
      el.dataset.scrollWidth = el.clientWidth.toString()
      el.classList.add('is-collapsed')
    }
    else {
      el.classList.add('is-collapsed')
      el.dataset.scrollWidth = el.clientWidth.toString()
      el.classList.remove('is-collapsed')
    }

    el.style.width = `${el.scrollWidth}px`
    el.style.overflow = 'hidden'
  },
  onLeave(el: HTMLElement) {
    el.classList.add('horizontal-collapse-transition')
    el.style.width = `${el.dataset.scrollWidth}px`
  },
  onAfterLeave(el: HTMLElement) {
    el.classList.remove('horizontal-collapse-transition')
    el.style.width = ''
    el.style.overflow = ''
  },
} as BaseTransitionProps<HTMLElement> as TransitionProps
</script>

<template>
    <div class="flex shrink-0 flex-col overflow-hidden bg-[#ffffff] border-r border-[#e2e3e6]">
        <Transition
            mode="out-in"
            v-bind="logoListeners"
        >
            <div
                :key="String(isCollapsed)"
                class="flex h-[--el-menu-item-height] items-center justify-between px-5 py-4 [&:not(is-collapsed)]:w-[250px]"
                :class="isCollapsed && 'is-collapsed'"
            >
                <span
                    v-if="!isCollapsed"
                    class="truncate text-[24px]/[100%] uppercase text-purple"
                >
                    LOGO
                </span>
                <ElButton
                    link
                    type="primary"
                    @click="toggleMenu"
                >
                    <ElIcon
                        :class="isCollapsed && 'rotate-180'"
                        size="22"
                    >
                        <DArrowLeft />
                    </ElIcon>
                </ElButton>
            </div>
        </Transition>
        <div class="flex grow flex-col overflow-hidden">
            <ElScrollbar>
                <ElMenu
                    class="border-r-0 [&:not(.el-menu--collapse)]:w-[250px]"
                    :collapse="isCollapsed"
                    @select="handleGoTo"
                >
                    <template
                        v-for="item in menuItems"
                        :key="item.id"
                    >
                        <ElSubMenu
                            v-if="item.children"
                            :index="item.id"
                        >
                            <template #title>
                                <ElIcon color="red">
                                    <component :is="item.icon" />
                                </ElIcon>
                                <span>
                                    {{ item.title }}
                                </span>
                            </template>
                            <ElMenuItem
                                v-for="child in item.children"
                                :key="child.id"
                                :index="child.pageName"
                            >
                                <span>
                                    {{ child.title }}
                                </span>
                            </ElMenuItem>
                        </ElSubMenu>
                        <ElMenuItem
                            v-else
                            :index="item.pageName"
                        >
                            <ElIcon>
                                <component :is="item.icon" />
                            </ElIcon>
                            <span>
                                {{ item.title }}
                            </span>
                        </ElMenuItem>
                    </template>
                </ElMenu>
            </ElScrollbar>
        </div>
    </div>
</template>

<style lang="scss" scoped>
:deep(.el-menu) {
  --el-menu-item-font-size: 16px;
  --el-menu-item-height: 55px;
  --el-menu-sub-item-height: calc(var(--el-menu-item-height) - 8px);
  --el-menu-icon-width: 24px;

  .el-menu-item > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.is-collapsed {
  width: 0;
}

:deep(.el-icon) {
    color: #009ae0
}
</style>
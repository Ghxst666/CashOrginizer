<script setup lang="ts">
import { BaseTransitionProps, computed, ref, TransitionProps } from 'vue';
import { useEventListener } from '@vueuse/core'
import { DArrowLeft, SwitchButton } from '@element-plus/icons-vue';
import { menuItems } from '../const/menu.const';
import { useRoute, useRouter } from 'vue-router';
import logoUrl from '@/shared/assets/logo.svg'
import { useAuthStore } from '@/shared/store/auth.store'

const BREAKPOINT_COLLAPSE = 1327
const BREAKPOINT_MOBILE = 768

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const activeMenuItem = computed(() => String(route.name ?? ''))

const isCollapsed = ref<boolean>(window.innerWidth <= BREAKPOINT_COLLAPSE)
const isMobile = ref<boolean>(window.innerWidth <= BREAKPOINT_MOBILE)
const mobileNavItems = computed(() => menuItems.flatMap(item => item.children
  ? item.children.map(child => ({ ...child, icon: child.icon ?? item.icon }))
  : [item],
))

function toggleMenu() {
  isCollapsed.value = !isCollapsed.value
}

function handleGoTo(pageName: string | undefined) {
  if (pageName) {
    router.push({ name: pageName })
  }
}

function handleLogout() {
  authStore.logout()
}

function updateWidth() {
  const width = window.innerWidth

  isMobile.value = width <= BREAKPOINT_MOBILE
  isCollapsed.value = isMobile.value || width <= BREAKPOINT_COLLAPSE
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
    <div
        v-if="!isMobile"
        class="flex shrink-0 flex-col overflow-hidden bg-[#ffffff] border-r border-[#e2e3e6]"
    >
        <Transition
            mode="out-in"
            v-bind="logoListeners"
        >
            <div
                :key="String(isCollapsed)"
                class="flex h-[--el-menu-item-height] items-center py-4"
                :class="[isCollapsed ? 'w-[64px] justify-center px-0' : 'w-[250px] justify-between px-5', isCollapsed && 'is-collapsed']"
            >
                <img
                    v-if="!isCollapsed"
                    class="h-9 w-[150px] shrink-0 object-contain object-left"
                    :src="logoUrl"
                    alt="Cash Org"
                >
                <ElButton
                    class="menu-collapse-button"
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
                    :default-active="activeMenuItem"
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
        <div class="shrink-0 border-t border-[#e2e3e6] p-3">
            <ElButton
                class="logout-button"
                :class="isCollapsed ? 'logout-button--collapsed' : 'w-full'"
                type="danger"
                :icon="SwitchButton"
                :circle="isCollapsed"
                @click="handleLogout"
            >
                <span v-if="!isCollapsed">Выйти</span>
            </ElButton>
        </div>
    </div>

    <nav
        v-else
        class="mobile-bottom-nav"
        aria-label="Навигация"
    >
        <button
            v-for="item in mobileNavItems"
            :key="item.id"
            class="mobile-bottom-nav__item"
            :class="{ 'mobile-bottom-nav__item--active': activeMenuItem === item.pageName }"
            type="button"
            @click="handleGoTo(item.pageName)"
        >
            <ElIcon size="21">
                <component :is="item.icon" />
            </ElIcon>
            <span>{{ item.title }}</span>
        </button>

        <button
            class="mobile-bottom-nav__item mobile-bottom-nav__item--logout"
            type="button"
            @click="handleLogout"
        >
            <ElIcon size="21">
                <SwitchButton />
            </ElIcon>
            <span>Выйти</span>
        </button>
    </nav>
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

:deep(.el-icon) {
    color: #009ae0
}

:deep(.el-menu--collapse .el-menu-item),
:deep(.el-menu--collapse .el-sub-menu__title) {
  justify-content: center;
  padding-right: 0 !important;
  padding-left: 0 !important;
}

:deep(.el-menu--collapse .el-icon) {
  margin-right: 0;
}

.menu-collapse-button,
.logout-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.logout-button :deep(.el-icon) {
  margin: 0;
}

.logout-button--collapsed {
  width: 40px;
  height: 40px;
  padding: 0;
}

.mobile-bottom-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: grid;
  grid-auto-columns: minmax(72px, 1fr);
  grid-auto-flow: column;
  height: calc(68px + env(safe-area-inset-bottom));
  padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
  border-top: 1px solid #d7dde5;
  background: rgb(255 255 255 / 96%);
  box-shadow: 0 -8px 28px rgb(15 23 42 / 12%);
  gap: 4px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}

.mobile-bottom-nav::-webkit-scrollbar {
  display: none;
}

.mobile-bottom-nav__item {
  display: inline-flex;
  min-width: 72px;
  height: 56px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #5f6b7a;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.1;
  gap: 4px;
}

.mobile-bottom-nav__item :deep(.el-icon) {
  color: currentcolor;
}

.mobile-bottom-nav__item--active {
  background: #e6f6fd;
  color: #008fcb;
}

.mobile-bottom-nav__item--logout {
  color: #c2413a;
}
</style>

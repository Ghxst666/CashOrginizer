<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import ru from 'element-plus/es/locale/lang/ru'
import { RouterView } from 'vue-router';
</script>

<template>
  <ElConfigProvider :locale="ru">
    <RouterView />
  </ElConfigProvider>
</template>
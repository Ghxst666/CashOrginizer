import { createApp } from "vue";
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import App from "./App.vue";

import './styles/tailwind.css'
import { router } from "./providers/router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { configureApiBaseUrl } from "@/shared/lib/api/configureApiBaseUrl";
const pinia = createPinia()


async function bootstrap() {
  await configureApiBaseUrl()

  const app = createApp(App)

  app.use(router)
  app.use(ElementPlus)
  app.use(pinia)
  app.use(VueQueryPlugin)
  app.mount('#app')
}

void bootstrap()

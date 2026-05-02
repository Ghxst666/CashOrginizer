import { createApp } from "vue";
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import App from "./App.vue";

import './styles/tailwind.css'
import { router } from "./providers/router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
const pinia = createPinia()


const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.use(VueQueryPlugin)
app.mount('#app')

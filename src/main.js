import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'element-plus/dist/index.css'
import axios from 'axios'

const app = createApp(App)

axios.defaults.baseURL = 'https://dragondj.space'

app.use(createPinia())
app.use(router)

app.mount('#app')

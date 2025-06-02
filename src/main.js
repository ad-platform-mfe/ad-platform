import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import microApp from '@micro-zoe/micro-app'

// 初始化micro-app
microApp.start({
  plugins: {
    modules: {
      // 子应用的名称
      'child-home': [
        {
          loader(code) {
            if (process.env.NODE_ENV === 'development') {
              // 这里做了一个开发环境的适配
              code = code.replace(/(from|import)(\s*['"])(\/child-home\/)/g, all => {
                return all.replace('/child-home/', 'http://localhost:3000/child-home/')
              })
            }
            return code
          }
        }
      ]
    }
  }
})

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

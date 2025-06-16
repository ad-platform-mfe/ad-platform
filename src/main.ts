import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import microApp from '@micro-zoe/micro-app';

// 初始化 micro-app
microApp.start({
  plugins: {
    modules: {
      'ad-home': [
        {
          // 开启 esmodule 模式，适用于 Vite 子应用
          esmodule: true,
        } as any,
      ],
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(Antd);
app.mount('#app');

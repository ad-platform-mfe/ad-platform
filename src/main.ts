import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
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
      'ad-material': [
        {
          esmodule: true,
        } as any,
      ],
      'ad-shop': [
        {
          esmodule: true,
        } as any,
      ],
      'ad-finance': [
        {
          esmodule: true,
        } as any,
      ],
      'ad-service': [
        {
          esmodule: true,
        } as any,
      ],
      'ad-setting': [
        {
          esmodule: true,
        } as any,
      ],
    },
  },
  preFetchApps: [
    { name: 'ad-home', url: 'http://localhost:8081/' },
    // { name: 'ad-home', url: 'http://localhost:5175/' },
    // { name: 'ad-material', url: 'http://localhost:5176/' },
    // { name: 'ad-shop', url: 'http://localhost:5173/' },
    // { name: 'ad-finance', url: 'http://localhost:5179/' },
    // { name: 'ad-service', url: 'http://localhost:5180/' },
  ],
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Antd);
app.mount('#app');

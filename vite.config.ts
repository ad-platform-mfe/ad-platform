import { fileURLToPath, URL } from 'node:url';

import { defineConfig, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const config: UserConfig = {
  base: '/main/',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag: string) => tag.startsWith('micro-app'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5174,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
      },
    },
  },
};

export default defineConfig(config);

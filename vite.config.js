import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/main/',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('micro-app'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5174,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://hrotest.huokesaas.com',
        changeOrigin: true
      },
      '/child-home': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }

})

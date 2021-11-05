import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import vueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,

      // you need to set i18n resource including paths !
      include: path.resolve(__dirname, './src/locales/**')
    })
  ],
  server: {
    cors: true,
    proxy: {
      // with options
      "/api": {
        target: "http://localhost:4321", //4321 for MongoDB and 3004 for Mock JSON-server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['slash', 'lodash/startCase']
  },
  build: {
    // needed for StoryBook Build --> large vendor chunks ...
    // chunkSizeWarningLimit: 5000,
  }
})

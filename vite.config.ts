import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    cors: true,
    proxy: {
      // with options
      "/api": {
        target: "http://localhost:4321", //3001 for MongoDB and 3004 for Mock JSON-server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      $components: path.resolve("./src/components"),
      $services: path.resolve("./src/services"),
      $types: path.resolve("./src/types"),
    },
  },
})

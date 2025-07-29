import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // GitHub Pages 配置
  base: '/hexagrams-query/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 确保资源路径正确
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})

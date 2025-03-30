import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://color-dorm-378d8e0e1e23.herokuapp.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

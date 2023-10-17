import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
// change dist to docs

export default defineConfig({
  base: "/ufc-combos/",
  plugins: [vue()],
  build: {
    outDir: "docs"
  }
})

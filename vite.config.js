import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Update base to '/<your-repo-name>/' if the repo name differs from
// 'impi-event-plans' before deploying to GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: '/impi-event-plans/',
})

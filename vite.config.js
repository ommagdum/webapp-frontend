import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import babel from 'vite-plugin-babel';


// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), babel()],
})

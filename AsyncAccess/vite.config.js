// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api/v1': { // Match the prefix of your API routes
        target: 'http://localhost:5173', // Your backend server address
        changeOrigin: true,
      },
    },
  },
})
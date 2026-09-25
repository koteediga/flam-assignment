import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Frontend calls /api/*, Vite forwards it to the local backend during dev.
      '/api': 'http://localhost:8787',
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Allow importing workspace packages by name
    alias: {},
  },
  server: {
    port: 5173,
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

console.log('Vite config is being loaded');

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // or your custom port
  },
});

import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    },
    hmr: {
      // Allow HMR to work on Fly.io domain
      clientPort: 443,
      path: 'hmr',
      host: 'parliament-watch.fly.dev'
    },
    // Allow the Fly.io domain
    allowedHosts: [
      'parliament-watch.fly.dev',
      '.fly.dev',
      'localhost'
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // Optimize memory usage
  optimizeDeps: {
    exclude: ['fsevents']
  }
});
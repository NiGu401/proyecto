import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictSSL: false,
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const ip = req.socket?.remoteAddress || '127.0.0.1';
            proxyReq.setHeader('X-Forwarded-For', ip);
            proxyReq.setHeader('X-Real-IP', ip);
          });
        },
      },
      '/login': {
        target: 'http://0.0.0.0:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const ip = req.socket?.remoteAddress || '127.0.0.1';
            proxyReq.setHeader('X-Forwarded-For', ip);
            proxyReq.setHeader('X-Real-IP', ip);
          });
        },
      },
      '/logout': {
        target: 'http://0.0.0.0:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const ip = req.socket?.remoteAddress || '127.0.0.1';
            proxyReq.setHeader('X-Forwarded-For', ip);
            proxyReq.setHeader('X-Real-IP', ip);
          });
        },
      },
      '/captcha': {
        target: 'http://0.0.0.0:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const ip = req.socket?.remoteAddress || '127.0.0.1';
            proxyReq.setHeader('X-Forwarded-For', ip);
            proxyReq.setHeader('X-Real-IP', ip);
          });
        },
      },
      '/registro': {
        target: 'http://0.0.0.0:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const ip = req.socket?.remoteAddress || '127.0.0.1';
            proxyReq.setHeader('X-Forwarded-For', ip);
            proxyReq.setHeader('X-Real-IP', ip);
          });
        },
      },
    },
  },
  build: {
    sourcemap: false,
  },
})

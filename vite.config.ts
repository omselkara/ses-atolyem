import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable.png'],
    manifest: {
      id: '/', name: 'Ses Atölyem', short_name: 'Ses Atölyem', lang: 'tr',
      description: 'Ses, nefes ve diksiyon. Kendi ritminde, her gün biraz daha.',
      start_url: '/', scope: '/', display: 'standalone',
      background_color: '#f8f7fc', theme_color: '#7460d9',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
      navigateFallback: '/index.html',
      maximumFileSizeToCacheInBytes: 4000000,
      cleanupOutdatedCaches: true
    }
  })],
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: { sourcemap: false }
});

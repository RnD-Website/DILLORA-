import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  // `vite build --mode artifact`: relative paths, no service worker (embedded preview)
  base: mode === 'artifact' ? './' : '/',
  plugins: [
    react(),
    mode !== 'artifact' && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/favicon.svg'],
      manifest: {
        name: 'DILLORA — Premium Cucumber Dill Pickles',
        short_name: 'DILLORA',
        description: 'Fresh cucumbers, aromatic dill and a perfectly balanced brine.',
        theme_color: '#A8B76A',
        background_color: '#34452A',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,svg}', 'images/jars/*-md.webp'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: { cacheName: 'dillora-images', expiration: { maxEntries: 80 } },
          },
        ],
      },
    }),
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap', 'gsap/ScrollTrigger'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
}));

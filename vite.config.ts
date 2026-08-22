import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['trinetra-icon.svg'],
      manifest: {
        name: 'TriNetra',
        short_name: 'TriNetra',
        description: 'Advanced Disaster Response & Coordination System',
        theme_color: '#1b1c1b',
        background_color: '#1b1c1b',
        display: 'standalone',
        icons: [
          {
            src: 'trinetra-icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})

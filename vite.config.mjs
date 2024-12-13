import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import Components from 'unplugin-vue-components/vite'
import Layouts from 'vite-plugin-vue-layouts'
import ViteFonts from 'unplugin-fonts/vite'
import dsv from '@rollup/plugin-dsv'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    watch: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    },
    outDir: '../_static/front', // Replace with the actual path to your Django static folder
  },
  plugins: [
    dsv(),
    Layouts(),
    Vue({
      template: { transformAssetUrls },
    }),
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Components(),
    ViteFonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          },
        ],
      },
    }),
    {
      name: 'write-to-disk',
      writeBundle(options, bundle) {
        if (process.env.NODE_ENV !== 'development') {
          Object.keys(bundle).forEach((fileName) => {
            const filePath = path.resolve(__dirname, '../_static/front', fileName)
            fs.writeFileSync(filePath, bundle[fileName].code || bundle[fileName].source)
          })
        }
      },
    },
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    port: 3000,
  },
})